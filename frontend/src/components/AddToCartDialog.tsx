"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { AddToCartFormData, addToCartSchema } from "@/schemas/cart.schema";
import Image from "next/image";
import { toast } from "sonner";

// Mock data - replace with actual shoe data
const AVAILABLE_SIZES = [
  "US 6",
  "US 6.5",
  "US 7",
  "US 7.5",
  "US 8",
  "US 8.5",
  "US 9",
  "US 9.5",
  "US 10",
  "US 10.5",
  "US 11",
  "US 11.5",
  "US 12",
];

const AVAILABLE_COLORS = [
  { id: "black", name: "Black", hex: "#000000" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "red", name: "Red", hex: "#DC2626" },
  { id: "blue", name: "Blue", hex: "#2563EB" },
  { id: "gray", name: "Gray", hex: "#6B7280" },
];

type AddToCartDialogProps = {
  toggleDialog: (open: boolean) => void;
  open: boolean;
  shoeData: {
    id: string;
    name: string;
    image: string;
    price: number;
    availableSizes?: string[];
    availableColors?: Array<{ id: string; name: string; hex: string }>;
  };
  onAddToCart: (data: AddToCartFormData & { shoeId: string }) => void;
  onOrderNow: (data: AddToCartFormData & { shoeId: string }) => void;
};

const AddToCartDialog = ({
  toggleDialog,
  open,
  shoeData,
  onAddToCart,
  onOrderNow,
}: AddToCartDialogProps) => {
  const form = useForm<AddToCartFormData>({
    resolver: zodResolver(addToCartSchema),
    defaultValues: {
      quantity: 1,
      size: "",
      color: "",
      name: shoeData.name,
      image: shoeData.image,
      price: shoeData.price,
    },
  });

  const { watch, setValue } = form;
  const quantity = watch("quantity");
  console.log("Form Data: ", form.getValues());

  const handleQuantityChange = (increment: boolean) => {
    const currentQuantity = quantity;
    const newQuantity = increment
      ? Math.min(currentQuantity + 1, 10)
      : Math.max(currentQuantity - 1, 1);
    setValue("quantity", newQuantity);
  };

  const handleSaveToCart = (data: AddToCartFormData) => {
    onAddToCart({ ...data, shoeId: shoeData.id });
    toggleDialog(false);
    form.reset();
  };

  const handleOrderNow = (data: AddToCartFormData) => {
    onOrderNow({ ...data, shoeId: shoeData.id });
    toggleDialog(false);
    form.reset();
  };
  const onFormError = (errors: any) => {
    console.error("Form Errors:", errors);
    console.log("Current Form Values:", form.getValues());
    toast.error("Please fill out all required fields.", {
      description:
        "Select a size and color to continue.\n" +
        "Current Form Values: " +
        JSON.stringify(form.getValues()),
    });
  };

  const handleCancel = () => {
    toggleDialog(false);
    form.reset();
  };

  const availableSizes = shoeData.availableSizes || AVAILABLE_SIZES;
  const availableColors = shoeData.availableColors || AVAILABLE_COLORS;

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Cart</DialogTitle>
          <DialogDescription>
            Configure your selection for{" "}
            <span className="font-semibold">{shoeData.name}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6">
            {/* Product Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Image
                src={shoeData.image}
                alt={shoeData.name}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-sm">{shoeData.name}</h3>
                <p className="text-lg font-bold">
                  ${shoeData.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quantity Selection */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(false)}
                        disabled={quantity <= 1}
                      >
                        <Minus size={16} />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        max="10"
                        className="w-20 text-center"
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          field.onChange(Math.max(1, Math.min(10, value)));
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(true)}
                        disabled={quantity >= 10}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Size Selection */}
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Selection */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-3"
                    >
                      {availableColors.map((color) => (
                        <div
                          key={color.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={color.id}
                            id={color.id}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={color.id} // This links the label to the radio item
                            className={`
                              flex flex-col items-center gap-1 p-2 rounded-lg border-2 cursor-pointer
                              transition-colors hover:bg-gray-50
                              ${
                                field.value === color.id
                                  ? "border-black bg-gray-50"
                                  : "border-gray-200"
                              }
                            `}
                            onClick={() => field.onChange(color.id)} // Ensure clicking the label selects the radio item
                          >
                            <div
                              className="w-6 h-6 rounded-full border"
                              style={{
                                backgroundColor: color.hex,
                                borderColor:
                                  color.hex === "#FFFFFF"
                                    ? "#E5E7EB"
                                    : color.hex,
                              }}
                            />
                            <span className="text-xs font-medium">
                              {color.name}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between gap-2 sm:justify-between">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={form.handleSubmit(handleSaveToCart, onFormError)}
                >
                  Save to Cart
                </Button>
                <Button
                  type="button"
                  onClick={form.handleSubmit(handleOrderNow, onFormError)}
                >
                  Order Now
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartDialog;
