"use client";

import { CartItem } from "./CartItem";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { Separator } from "./ui/separator";
import { CartItemData, mockRecommendedItem } from "@/lib/mock-checkout-data";

interface OrderSummaryProps {
  items: CartItemData[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onRemove: (shoeId: string, size: string, color: string) => void;
  onUpdateQuantity: (
    shoeId: string,
    size: string,
    color: string,
    quantityChange: number
  ) => void;
}

const OrderSummary = ({
  items,
  subtotal,
  shipping,
  tax,
  total,
  onRemove,
  onUpdateQuantity,
}: OrderSummaryProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Order Summary ({items.length} items)
        </h2>
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem
              key={`${item.shoeId}-${item.size}-${item.color}`}
              item={item}
              onRemove={onRemove}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <label htmlFor="discount-code" className="font-medium">
          Discount code
        </label>
        <div className="flex space-x-2 mt-2">
          <Input id="discount-code" placeholder="Enter code" />
          <Button>Add code</Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-xl font-semibold mb-4">Recommended for you</h3>
        <div className="flex items-center space-x-4 p-4 border rounded-lg">
          <Image
            src={mockRecommendedItem.image}
            alt={mockRecommendedItem.name}
            width={100}
            height={100}
            className="rounded-md bg-gray-100"
          />
          <div className="flex-grow">
            <h4 className="font-medium">{mockRecommendedItem.name}</h4>
            <p className="text-sm text-gray-500_ mt-1">
              {mockRecommendedItem.description}
            </p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="font-semibold text-red-600">
                ${mockRecommendedItem.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${mockRecommendedItem.originalPrice.toFixed(2)}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <PlusCircle className="h-6 w-6 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
