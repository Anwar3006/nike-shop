"use client";

import { cn } from "@/lib/utils";
import { Shoe } from "@/types/shoes";
import Image from "next/image";

interface ColorSelectorProps {
  colors: Shoe["colors"];
  selectedColorStyle: string;
  onSelectColor: (styleNumber: string) => void;
}

export default function ColorSelector({
  colors,
  selectedColorStyle,
  onSelectColor,
}: ColorSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900">Color</h3>
      <div className="flex items-center space-x-3 mt-4">
        {colors.map((color) => (
          <div
            key={color.styleNumber}
            className={cn(
              "relative w-16 h-16 rounded-md overflow-hidden cursor-pointer",
              selectedColorStyle === color.styleNumber
                ? "ring-2 ring-primary ring-offset-2"
                : ""
            )}
            onClick={() => onSelectColor(color.styleNumber)}
          >
            <Image
              src={color.images[0]}
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
