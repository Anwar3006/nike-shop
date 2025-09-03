import Image from "next/image";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

type CartItemProps = {
  item: {
    shoeId: string;
    name: string;
    image: string;
    color: string | undefined;
    price: number;
    quantity: number;
    size: string;
  };
  onRemove: (shoeId: string, size: string) => void;
  onUpdateQuantity: (
    shoeId: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
};

export const CartItem = ({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) => {
  console.log("Rendering CartItem: ", item);
  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center space-x-4">
        <Image
          src={item.image}
          alt={item.name}
          width={128}
          height={128}
          className="rounded-md"
        />
        <div>
          <h3 className="text-lg font-medium">{item.name}</h3>
          <p className="text-sm text-gray-500">Size: {item.size}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                onUpdateQuantity(item.shoeId, item.size, item.color || "", -1)
              }
              disabled={item.quantity <= 1}
            >
              -
            </Button>
            <span>{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                onUpdateQuantity(item.shoeId, item.size, item.color || "", 1)
              }
            >
              +
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <p className="text-lg font-medium">${item.price.toFixed(2)}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.shoeId, item.size)}
        >
          <Trash2 className="h-5 w-5 text-red-500" />
        </Button>
      </div>
    </div>
  );
};
