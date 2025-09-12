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

type AddToCartDialogProps = {
  toggleDialog: (open: boolean) => void;
  open: boolean;
  shoeData: {
    id: string;
    name: string;
    image: string;
    price: number;
    availableSizes: string[];
    availableColors: Array<{ id: string; name: string; hex: string }>;
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

  const handleQuantityChange = (increment: boolean) => {
    const currentQuantity = quantity;
    const newQuantity = increment
      ? Math.min(currentQuantity + 1, 10)
      : Math.max(currentQuantity - 1, 1);
    setValue("quantity", newQuantity);
  };

  const handleSaveToCart = (data: AddToCartFormData) => {
    const selectedColor = shoeData.availableColors.find(
      (c) => c.id === data.color
    );
    onAddToCart({
      ...data,
      shoeId: shoeData.id,
      color: selectedColor?.name || "",
    });
    toggleDialog(false);
    form.reset();
  };

  const handleOrderNow = (data: AddToCartFormData) => {
    const selectedColor = shoeData.availableColors.find(
      (c) => c.id === data.color
    );
    onOrderNow({
      ...data,
      shoeId: shoeData.id,
      color: selectedColor?.name || "",
    });
    toggleDialog(false);
    form.reset();
  };

  const onFormError = (errors: unknown) => {
    console.error("Form Errors:", errors);
    toast.error("Please fill out all required fields.", {
      description: "Select a size and color to continue.",
    });
  };

  const handleCancel = () => {
    toggleDialog(false);
    form.reset();
  };

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
                      {shoeData.availableSizes.map((size) => (
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
                      {shoeData.availableColors.map((color) => (
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
                            htmlFor={color.id}
                            className={`
                              flex flex-col items-center gap-1 p-2 rounded-lg border-2 cursor-pointer
                              transition-colors hover:bg-gray-50
                              ${
                                field.value === color.id
                                  ? "border-black bg-gray-50"
                                  : "border-gray-200"
                              }
                            `}
                            onClick={() => field.onChange(color.id)}
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
