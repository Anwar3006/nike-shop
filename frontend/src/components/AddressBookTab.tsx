"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Home, Briefcase, MapPin } from "lucide-react";
import { toast } from "sonner";

import { AddressEditDialog } from "./AddressEditDialog";
import { AddressFormData } from "@/schemas/auth.schema";
import { Address } from "@/types";
import { useUpsertAddress } from "@/hooks/api/use-userInfo";

export interface Address2 {
  type: "Home" | "Work";
  icon: React.ReactNode;
  address: string;
  phone: string;
  isDefault: boolean;
}

const AddressBookTab = ({ userAddresses }: { userAddresses: Address[] }) => {
  const { mutateAsync, isPending } = useUpsertAddress();
  const [addresses, setAddresses] = useState<Address2[]>([
    {
      type: "Home" as const,
      icon: <Home className="w-5 h-5 text-gray-500" />,
      address: "123 Market St, San Francisco, CA 94103",
      phone: "+1 234 567 890",
      isDefault: true,
    },
    {
      type: "Work" as const,
      icon: <Briefcase className="w-5 h-5 text-gray-500" />,
      address: "456 Main St, Oakland, CA 94612",
      phone: "+1 098 765 432",
      isDefault: false,
    },
  ]);

  const transformedAddresses =
    userAddresses && userAddresses.length > 0
      ? userAddresses.map((addr) => {
          return {
            type: addr.type,
            address: `${addr.streetAddress}, ${addr.city}, ${addr.state} ${addr.zipCode}`,
            phone: addr.phoneNumber,
            isDefault: addr.isDefault,
            icon:
              addr.type === "Home" ? (
                <Home className="w-5 h-5 text-gray-500" />
              ) : addr.type === "Work" ? (
                <Briefcase className="w-5 h-5 text-gray-500" />
              ) : (
                <MapPin className="w-5 h-5 text-gray-500" />
              ),
            originalAddress: addr,
          };
        })
      : [];

  const handleAddressSave = async (
    formData: AddressFormData,
    index?: number
  ) => {
    try {
      console.log("Saving address:", formData);
      mutateAsync({
        addressId: index ? userAddresses[index].id : undefined,
        ...formData,
      });

      // Show success message
      toast.success("Address updated successfully!");
    } catch (error) {
      console.error("Failed to update address:", error);
      toast.error("Failed to update address. Please try again.");
      throw error; // Re-throw to handle in dialog
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Address Book</h2>
        <AddressEditDialog
          address={{} as Address}
          onSave={(formData: AddressFormData) => handleAddressSave(formData)}
          trigger={<Button type="button">Add Address</Button>}
        />
      </div>

      <div className="space-y-4">
        {transformedAddresses.map((addr, index) => (
          <div
            key={index}
            className="p-6 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4"
          >
            <div className="flex gap-4">
              {addr.icon}
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{addr.type}</h3>
                  {addr.isDefault && (
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{addr.address}</p>
                <p className="text-gray-600">{addr.phone}</p>
              </div>
            </div>
            <AddressEditDialog
              address={addr.originalAddress}
              onSave={(formData: AddressFormData) =>
                handleAddressSave(formData, index)
              }
              trigger={
                <Button type="button" variant="outline" size="sm">
                  Edit
                </Button>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressBookTab;
