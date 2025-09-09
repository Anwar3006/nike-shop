"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import OrderSummary from "./OrderSummary";
import PaymentDetails from "./PaymentDetails";

import {
  useGetCart,
  useRemoveFromCart,
  useUpdateCartItemQuantity,
} from "@/hooks/cache/use-cart";
import { Loader2 } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useGetUserInfo, useUpsertAddress } from "@/hooks/api/use-userInfo";
import { Address } from "@/types";
import { AddressFormData } from "@/schemas/auth.schema";
import AddressEditDialog from "./AddressEditDialog";

const CheckoutForm = () => {
  const { data: cart, isPending } = useGetCart();
  const { mutate: updateQuantity } = useUpdateCartItemQuantity();
  const { mutate: removeItem, isPending: isRemovingFromCart } =
    useRemoveFromCart();

  const { data: userInfo, isPending: gettingUserInfo } = useGetUserInfo();
  const { mutate } = useUpsertAddress();

  const [showAddressDialog, setShowAddressDialog] = useState(false);

  const shippingAddress = userInfo?.data.addresses?.filter(
    (address: Address) => address.isDefault === true
  )[0];

  const handleAddressSave = (data: AddressFormData) => {
    mutate(data);
    setShowAddressDialog(false);
  };

  useEffect(() => {
    // if no address
    if (!gettingUserInfo && userInfo && userInfo.data.addresses?.length === 0) {
      setShowAddressDialog(true);
    }
  }, [userInfo, gettingUserInfo]);

  const orders: CartItem[] = useMemo(() => {
    if (!cart) return [];
    // Sort by addedAt to ensure a stable order
    const sortedCart = [...cart].sort(
      (a, b) => b.value.addedAt - a.value.addedAt
    );
    return sortedCart.map(
      ({ itemKey, value }: { itemKey: string; value: CartItem }) => {
        return { ...value };
      }
    );
  }, [cart]);

  const stripePromise = useMemo(() => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error("Stripe publishable key is not set.");
      return null;
    }
    return loadStripe(publishableKey);
  }, []);

  const handleRemove = (shoeId: string, size: string, color: string) => {
    removeItem({ cartItem: { shoeId, size, color } });
  };

  const handleUpdateQuantity = (
    shoeId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    updateQuantity({ shoeId, quantity, size, color });
  };

  const loadingData = isPending || gettingUserInfo;
  if (loadingData) {
    return (
      <div className="flex items-center gap-2 text-gray-500 h-full w-full font-bevellier">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading data...</span>
      </div>
    );
  }
  if (!stripePromise) {
    return (
      <div className="text-center text-red-500">Stripe not configured.</div>
    );
  }

  const subtotal = orders.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <div>
        <OrderSummary
          items={orders}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
          onRemove={handleRemove}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </div>
      <div>
        <Elements stripe={stripePromise}>
          <PaymentDetails
            total={total}
            cart={orders}
            userInfo={userInfo?.data}
            shippingAddress={shippingAddress}
          />
        </Elements>
      </div>

      <AddressEditDialog
        isOpen={showAddressDialog}
        onOpenChange={setShowAddressDialog}
        address={{} as Address}
        onSave={handleAddressSave}
        isDismissable={false}
      />
    </div>
  );
};

export default CheckoutForm;
