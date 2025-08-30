import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { AddressFormData, addressSchema } from "@/schemas/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Address } from "@/types";
import { Address2 } from "./AddressBookTab";

interface AddressEditDialogProps {
  address: Address2;
  onSave: (data: AddressFormData) => Promise<void> | void;
  trigger: React.ReactNode;
}

export function AddressEditDialog({
  address,
  onSave,
  trigger,
}: AddressEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Parse existing address for form defaults
  const parseAddress = (addressString: string) => {
    // Example: "123 Market St, San Francisco, CA 94103"
    const parts = addressString.split(", ");
    if (parts.length >= 3) {
      const streetAddress = parts[0] || "";
      const city = parts[1] || "";
      const stateZip = parts[2]?.split(" ");
      const state = stateZip?.[0] || "";
      const zipCode = stateZip?.[1] || "";

      return { streetAddress, city, state, zipCode };
    }

    return {
      streetAddress: addressString,
      city: "",
      state: "",
      zipCode: "",
    };
  };

  const parsedAddress = parseAddress(address.address);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      streetAddress: parsedAddress.streetAddress,
      city: parsedAddress.city,
      state: parsedAddress.state,
      zipCode: parsedAddress.zipCode,
      telephone: address.phone,
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    try {
      setIsLoading(true);
      await onSave(data);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to save address:", error);
      // Handle error - could show toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {address.type} Address</DialogTitle>
          <DialogDescription>
            Update your address information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="San Francisco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="CA"
                        maxLength={2}
                        style={{ textTransform: "uppercase" }}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="94103" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
