"use client";

import { cn } from "@/lib/utils";
import { ShoeVariant } from "@/types/shoes";
import Image from "next/image";

interface ColorSelectorProps {
  colors: { id: string; name: string; hex: string }[];
  selectedColorId: string | null;
  onSelectColor: (colorId: string) => void;
  variants: ShoeVariant[];
}

export default function ColorSelector({
  colors,
  selectedColorId,
  onSelectColor,
  variants,
}: ColorSelectorProps) {
  const getColorImage = (colorId: string) => {
    const variant = variants.find((v) => v.color.id === colorId);
    return variant?.images[0]?.url || "/placeholder.png";
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900">Color</h3>
      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-4">
        {colors.map((color) => (
          <div
            key={color.id}
            className={cn(
              "relative w-16 h-16 rounded-md overflow-hidden cursor-pointer",
              selectedColorId === color.id
                ? "ring-2 ring-primary ring-offset-2"
                : ""
            )}
            onClick={() => onSelectColor(color.id)}
          >
            <Image
              src={getColorImage(color.id)}
              alt={color.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
