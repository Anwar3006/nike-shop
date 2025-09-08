"use client";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { DeleteDialog } from "./DeleteDialog";
import { useState } from "react";

// Define the type for the component's props
type OrderItemProps = {
  id: string;
  status: "Delivered" | "Estimated arrival";
  date: string;
  imageUrl: string;
  name: string;
  category: string;
  size: number | string;
  quantity: number;
  price: number;
};

const OrderItem = ({
  id,
  status,
  date,
  imageUrl,
  name,
  category,
  size,
  quantity,
  price,
}: OrderItemProps) => {
  const statusColor =
    status === "Delivered" ? "text-green-600" : "text-yellow-600";

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const handleDelete = (id: string) => {
    console.log("Archiving order with ID:", id);
    // setDeleteDialogOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-6 py-3 px-2 md:p-6 bg-white rounded-lg shadow-sm border-b border-gray-200 w-full md:w-3/4">
      <div className="flex items-center gap-6 w-full">
        <div className="w-40 h-40 bg-gray-100 rounded-md flex-shrink-0">
          <Image
            src={imageUrl}
            alt={name}
            width={96}
            height={96}
            className="object-cover rounded-sm w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <p className={`text-sm font-semibold font-bevellier ${statusColor}`}>
            {status} {date}
          </p>
          <h3 className="text-lg font-bold text-gray-900 font-bevellier">
            {name}
          </h3>
          <p className="text-sm text-gray-500 font-bevellier">{category}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 font-bevellier">
            <span>Size: {size}</span>
            <span>Quantity: {quantity}</span>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between md:w-auto md:flex-col items-center gap-2 sm:gap-6 self-end sm:self-center">
        <p className="text-lg self-end font-bold text-gray-900 font-bevellier">
          ${price.toFixed(2)}
        </p>

        <DeleteDialog
          open={deleteDialogOpen}
          toggleDialog={setDeleteDialogOpen}
          resourceType="order"
          resourceId={id}
          handleDelete={handleDelete}
          isDeleting={true} //ToDo
        />
        <Button
          variant="ghost"
          className="text-red hover:text-red-600 px-0.5! self-end font-bevellier"
        >
          <Trash2 className="w-5 h-5" />
          <span
            className="hidden sm:inline"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Cancel Order
          </span>
        </Button>
      </div>
    </div>
  );
};

export default OrderItem;
