import { FormEvent } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { UserInfo } from "@/types";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

interface PaymentFormProps {
  formId: string;
  onSubmit: (event: FormEvent) => void;
  userInfo: UserInfo;
}

const PaymentForm = ({ formId, onSubmit, userInfo }: PaymentFormProps) => {
  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-6 py-6">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email Address</Label>
        <Input type="email" id="email" defaultValue={userInfo.email} required />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label>Card details</Label>
        <div className="p-3 border rounded-md bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Cardholder name</Label>
        <Input type="text" id="name" defaultValue={userInfo.name} required />
      </div>
      {/* Additional address fields from the design would go here */}
    </form>
  );
};

export default PaymentForm;
