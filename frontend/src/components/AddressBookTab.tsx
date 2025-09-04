"use client";

import { Button } from "./ui/button";
import { Home, Briefcase, MapPin } from "lucide-react";

import { AddressEditDialog } from "./AddressEditDialog";
import { AddressFormData } from "@/schemas/auth.schema";
import { Address } from "@/types";
import { useDeleteAddress, useUpsertAddress } from "@/hooks/api/use-userInfo";
import { DeleteDialog } from "./DeleteDialog";
import { useState } from "react";

const AddressBookTab = ({ userAddresses }: { userAddresses: Address[] }) => {
  const { mutateAsync } = useUpsertAddress();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

  const [open, setOpen] = useState(false);

  const transformedAddresses =
    userAddresses?.map((addr) => {
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
    }) || [];

  const handleAddressSave = async (
    formData: AddressFormData,
    addressId?: string
  ) => {
    console.log("Saving address:", formData);

    try {
      // If setting as default, handle the existing default first
      if (formData.isDefault) {
        const currentDefault = userAddresses.find((addr) => addr.isDefault);

        if (currentDefault && currentDefault.id !== addressId) {
          // Remove default from existing address first
          const currentAddress = {
            ...currentDefault,
            isDefault: false,
            zipcode: currentDefault.zipCode,
            phone: currentDefault.phoneNumber,
          };
          await mutateAsync(currentAddress);
        }
      }

      // Save/update the current address
      const addressData = {
        ...(addressId && { addressId }), // Only include if it exists
        ...formData,
      };

      await mutateAsync(addressData);
    } catch (error) {
      console.error("Error saving address:", error);
      throw error; // Re-throw to handle in dialog
    }
  };

  const handleAddressDelete = (addressId: string) => {
    deleteAddress(addressId);
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
        {transformedAddresses.map((addr) => (
          <div
            key={addr.originalAddress.id}
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
            <div className="flex items-center space-x-2">
              <AddressEditDialog
                address={addr.originalAddress}
                onSave={(formData: AddressFormData) =>
                  handleAddressSave(formData, addr.originalAddress.id)
                }
                trigger={
                  <Button type="button" variant="outline" size="sm">
                    Edit
                  </Button>
                }
              />
              <DeleteDialog
                handleDelete={handleAddressDelete}
                isDeleting={isDeleting}
                resourceType="address"
                resourceId={addr.originalAddress.id}
                open={open}
                toggleDialog={setOpen}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                onClick={() => setOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressBookTab;
