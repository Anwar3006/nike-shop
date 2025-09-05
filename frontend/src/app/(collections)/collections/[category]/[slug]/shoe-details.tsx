"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import { Shoe } from "@/types/shoes";
import ShoeImages from "@/components/ShoeImages";
import ShoeSizes from "@/components/ShoeSizes";
import ColorSelector from "@/components/ColorSelector";
import { Button } from "@/components/ui/button";

interface ShoeDetailsProps {
  shoe: Shoe;
}

export default function ShoeDetails({ shoe }: ShoeDetailsProps) {
  const [selectedColorStyle, setSelectedColorStyle] = useState(
    shoe.colors[0].styleNumber
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!shoe) {
    notFound();
  }

  const selectedColor = shoe.colors.find(
    (c) => c.styleNumber === selectedColorStyle
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:relative">
        {/* Left column */}
        <div className="lg:order-1 lg:sticky lg:top-8 lg:h-screen lg:overflow-hidden">
          <ShoeImages shoe={shoe} selectedColorStyle={selectedColorStyle} />
        </div>

        {/* Right column */}
        <div className="lg:order-2 lg:max-h-screen lg:overflow-y-auto lg:pb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {shoe.name}
          </h1>
          <p className="text-2xl text-gray-900 mt-2">${shoe.basePrice / 100}</p>
          <div className="mt-4">
            <p className="text-base text-gray-700">{shoe.description}</p>
          </div>
          <div className="mt-6">
            <ColorSelector
              colors={shoe.colors}
              selectedColorStyle={selectedColorStyle}
              onSelectColor={setSelectedColorStyle}
            />
          </div>
          <div className="mt-6">
            <ShoeSizes
              sizes={selectedColor?.size || []}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />
          </div>
          <div className="mt-8">
            <Button size="lg" className="w-full">
              Add to Bag
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
