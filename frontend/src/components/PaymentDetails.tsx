"use client";

import { useState, FormEvent } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Apple, CreditCard } from "lucide-react";
import PaymentForm from "./PaymentForm";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import axiosClient from "@/lib/api/client";
import { CartItem } from "@/types/cart";

import { Address, UserInfo } from "@/types";
import { useClearCart } from "@/hooks/cache/use-cart";

interface PaymentDetailsProps {
  total: number;
  cart: CartItem[];
  userInfo: UserInfo;
  shippingAddress: Address;
}

const PaymentDetails = ({
  total,
  cart,
  userInfo,
  shippingAddress,
}: PaymentDetailsProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);

  const { mutate: clearCart } = useClearCart();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const res = await axiosClient.post("/payments/create-payment-intent", {
        amount: Math.round(total * 100),
        cart,
        shippingAddressId: shippingAddress.id,
      });

      if (res.status !== 200) {
        toast.error("Failed to create payment intent. Please try again.", {
          description: res.data.error,
        });
        setIsProcessing(false);
        return;
      }

      const { clientSecret } = await res.data;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setIsProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: userInfo.name,
              email: userInfo.email,
            },
          },
        }
      );
      if (error) {
        toast.error(error.message);
      } else if (paymentIntent?.status === "succeeded") {
        toast.success("Payment Successful! Your order has been placed.");
        clearCart();
      }
    } catch (error: unknown) {
      toast.error(
        "Failed to create payment intent: " + (error as Error).message
      );
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">
              <CreditCard className="mr-2 h-4 w-4" /> Pay by Card
            </TabsTrigger>
            <TabsTrigger value="paypal" disabled>
              <Apple className="mr-2 h-4 w-4" /> Pay with PayPal
            </TabsTrigger>
          </TabsList>
          <TabsContent value="card">
            <PaymentForm
              formId="payment-form"
              onSubmit={handleSubmit}
              userInfo={userInfo}
            />
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="w-full flex justify-between font-bold text-xl pt-6">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          type="submit"
          form="payment-form"
          className="w-full"
          size="lg"
          disabled={isProcessing || !stripe || total === 0}
        >
          {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
        </Button>
        <p className="text-xs text-gray-500 text-center">
          Powered by Supplier • Terms • Privacy
        </p>
      </CardFooter>
    </Card>
  );
};

export default PaymentDetails;
