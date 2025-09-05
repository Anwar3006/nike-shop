"use client";

import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import OrderSummary from "./OrderSummary";
import PaymentDetails from "./PaymentDetails";
import { mockCartItems, CartItemData } from "@/lib/mock-checkout-data";

const CheckoutForm = () => {
  const [items, setItems] = useState<CartItemData[]>(mockCartItems);

  const stripePromise = useMemo(() => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error("Stripe publishable key is not set.");
      return null;
    }
    return loadStripe(publishableKey);
  }, []);

  const handleRemove = (shoeId: string, size: string, color: string) => {
    setItems((prev) => prev.filter((i) => !(i.shoeId === shoeId && i.size === size && i.color === color)));
  };

  const handleUpdateQuantity = (shoeId: string, size: string, color: string, quantityChange: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.shoeId === shoeId && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, item.quantity + quantityChange) }
          : item
      )
    );
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (!stripePromise) {
    return <div className="text-center text-red-500">Stripe not configured.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <div>
        <OrderSummary
          items={items}
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
          <PaymentDetails total={total} />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutForm;
