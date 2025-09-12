"use client";
import { useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { Shoe } from "@/types/shoes";
import ShoeImages from "@/components/ShoeImages";
import ShoeSizes from "@/components/ShoeSizes";
import ColorSelector from "@/components/ColorSelector";
import { Button } from "@/components/ui/button";

interface ShoeDetailsProps {
  shoe: Shoe;
}

export default function ShoeDetailsPage({ shoe }: ShoeDetailsProps) {
  // Get available colors from variants
  const availableColors = useMemo(() => {
    const colorsMap = new Map();
    shoe.variants.forEach((variant) => {
      if (variant.color && !colorsMap.has(variant.color.id)) {
        colorsMap.set(variant.color.id, variant.color);
      }
    });
    return Array.from(colorsMap.values());
  }, [shoe.variants]);

  // Initialize with first available color or default variant color
  const [selectedColorId, setSelectedColorId] = useState<string>(
    shoe.defaultVariant?.color?.id || availableColors[0]?.id || ""
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

  if (!shoe) {
    notFound();
  }

  // Get variants for selected color
  const selectedColorVariants = shoe.variants.filter(
    (variant) => variant.color.id === selectedColorId
  );

  // Get available sizes for selected color
  const availableSizes = selectedColorVariants.map((variant) => variant.size);

  // Get selected variant (color + size combination)
  const selectedVariant =
    selectedColorVariants.find(
      (variant) => variant.size.id === selectedSizeId
    ) || selectedColorVariants[0]; // Fallback to first variant of selected color

  // Get current price (use sale price if available, otherwise regular price)
  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.salePrice || selectedVariant.price)
    : parseFloat(shoe.variants[0]?.price || "0");

  // Get images for selected variant or first variant of selected color
  const currentImages =
    selectedVariant?.images || selectedColorVariants[0]?.images || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:relative">
        {/* Left column */}
        <div className="lg:order-1 lg:sticky lg:top-8 lg:h-screen lg:overflow-hidden">
          <ShoeImages images={currentImages} />
        </div>

        {/* Right column */}
        <div className="lg:order-2 lg:max-h-screen lg:overflow-y-auto lg:pb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {shoe.name}
          </h1>

          {/* Price Display */}
          <div className="mt-2">
            {selectedVariant?.salePrice &&
            parseFloat(selectedVariant.salePrice) <
              parseFloat(selectedVariant.price) ? (
              <div className="flex items-center gap-2">
                <p className="text-2xl text-red-600 font-semibold">
                  ${parseFloat(selectedVariant.salePrice).toFixed(2)}
                </p>
                <p className="text-lg text-gray-500 line-through">
                  ${parseFloat(selectedVariant.price).toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-2xl text-gray-900">
                ${currentPrice.toFixed(2)}
              </p>
            )}
          </div>

          <div className="mt-4">
            <p className="text-base text-gray-700">{shoe.description}</p>
          </div>

          <div className="mt-6">
            <ColorSelector
              colors={availableColors}
              selectedColorId={selectedColorId}
              onSelectColor={setSelectedColorId}
              variants={shoe.variants}
            />
          </div>

          <div className="mt-6">
            <ShoeSizes
              sizes={availableSizes}
              selectedSizeId={selectedSizeId}
              onSelectSize={setSelectedSizeId}
            />
          </div>

          {/* Stock Information */}
          {selectedVariant && (
            <div className="mt-4">
              {selectedVariant.inStock > 0 ? (
                <p className="text-sm text-green-600">
                  ✓ In Stock ({selectedVariant.inStock} available)
                </p>
              ) : (
                <p className="text-sm text-red-600">✗ Out of Stock</p>
              )}
            </div>
          )}

          <div className="mt-8">
            <Button
              size="lg"
              className="w-full"
              disabled={
                !selectedSizeId ||
                !selectedVariant ||
                selectedVariant.inStock === 0
              }
            >
              Add to Bag
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
