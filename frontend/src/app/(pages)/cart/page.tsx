"use client";

import React from "react";
import {
  useGetCart,
  useRemoveFromCart,
  useUpdateCartItemQuantity,
  useClearCart,
} from "@/hooks/cache/use-cart";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/DeleteDialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartItem as CartItemType } from "@/types/cart";
import { CartItem } from "@/components/CartItem";
import Error from "@/components/Error";

const CartPage = () => {
  const router = useRouter();
  const { isPending: sessionLoading } = useSession();
  const { data: cart, isLoading: isCartLoading, isError, error } = useGetCart();
  const { mutate: removeItem, isPending: isRemovingFromCart } =
    useRemoveFromCart();
  const { mutate: updateQuantity } = useUpdateCartItemQuantity();
  const { mutate: clearCart } = useClearCart();

  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleRemoveItem = (shoeId: string, size: string, color: string) => {
    removeItem({ cartItem: { shoeId, size, color } });
  };

  const handleUpdateQuantity = (
    shoeId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    updateQuantity({ shoeId, size, color, quantity });
  };

  const handleClearCart = () => {
    clearCart();
    setDeleteDialogOpen(false);
  };

  const transformedCart: CartItemType[] = React.useMemo(() => {
    if (!cart) return [];
    // Sort by name to ensure a stable order
    const sortedCart = [...cart].sort(
      (a, b) =>
        // a.value.name.localeCompare(b.value.name)
        b.value.addedAt - a.value.addedAt
    );
    return sortedCart.map(
      ({ itemKey, value }: { itemKey: string; value: CartItemType }) => {
        return { ...value };
      }
    );
  }, [cart]);

  const subtotal = React.useMemo(() => {
    if (!transformedCart || transformedCart.length === 0) return 0;
    return transformedCart.reduce(
      (acc: number, item: CartItemType) => acc + item.price * item.quantity,
      0
    );
  }, [transformedCart]);

  const deliveryFee = 2.0;
  const total = subtotal + deliveryFee;

  const pageIsLoading = isCartLoading || sessionLoading;

  if (pageIsLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Cart
        </h1>
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <Error title="Cart" error={error} />;
  }

  // If cart is empty
  if (!transformedCart || transformedCart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Cart
        </h1>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-gray-500 mt-2">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-bevellier">
          Cart
        </h1>
        <Button
          variant="outline"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={!transformedCart || transformedCart.length === 0}
        >
          Clear Cart
        </Button>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {transformedCart.map((item: CartItemType) => (
              <CartItem
                key={`${item.shoeId}-${item.size}`}
                item={{ ...item }}
                onRemove={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Estimated Delivery & Handling</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button asChild className="w-full mt-6">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>

      <DeleteDialog
        open={isDeleteDialogOpen}
        toggleDialog={setDeleteDialogOpen}
        resourceType="cart"
        resourceId="cart"
        handleDelete={handleClearCart}
        isDeleting={isRemovingFromCart}
      />
    </div>
  );
};

export default CartPage;
