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
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <div
          key={color.id}
          className={cn(
            "relative w-16 h-16 rounded-md overflow-hidden cursor-pointer border",
            selectedColorId === color.id
              ? "ring-2 ring-black ring-offset-2"
              : "border-gray-200"
          )}
          onClick={() => onSelectColor(color.id)}
          title={color.name}
        >
          <Image
            src={getColorImage(color.id)}
            alt={color.name}
            fill
            sizes="5vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
