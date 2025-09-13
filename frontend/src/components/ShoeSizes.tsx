"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ShoeSizesProps {
  sizes: { id: string; value: string }[];
  selectedSizeId: string | null;
  onSelectSize: (sizeId: string) => void;
}

export default function ShoeSizes({
  sizes,
  selectedSizeId,
  onSelectSize,
}: ShoeSizesProps) {
  console.log("Sizes: ", sizes);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Size</h3>
        <a
          href="#"
          className="text-sm font-medium text-primary hover:text-primary/90"
        >
          Size Guide
        </a>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-2 mt-4">
        {sizes.map((size) => (
          <Button
            key={size.id}
            variant={selectedSizeId === size.id ? "default" : "outline"}
            onClick={() => onSelectSize(size.id)}
            className={cn(
              "w-full",
              selectedSizeId === size.id &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {size.value}
          </Button>
        ))}
      </div>
    </div>
  );
}
