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
  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {sizes.map((size) => (
        <Button
          key={size.id}
          variant="outline"
          onClick={() => onSelectSize(size.id)}
          className={cn(
            "w-full h-12 text-base",
            selectedSizeId === size.id &&
              "bg-black text-white hover:bg-black/90"
          )}
        >
          {size.value}
        </Button>
      ))}
    </div>
  );
}
