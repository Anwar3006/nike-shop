"use client";
import { useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { Shoe } from "@/types/shoes";
import ShoeImages from "@/components/ShoeImages";
import ShoeSizes from "@/components/ShoeSizes";
import ColorSelector from "@/components/ColorSelector";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/cache/use-cart";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAddFavorite } from "@/hooks/api/use-favorites";
import { useGetUserInfo } from "@/hooks/api/use-userInfo";

interface ShoeDetailsProps {
  shoe: Shoe;
}

export default function ShoeDetails({ shoe }: ShoeDetailsProps) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const { mutate, isPending: isFavoritePending } = useAddFavorite();
  const { data: userInfo, isPending: gettingUserInfo } = useGetUserInfo();

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
  // console.log("availableColors: ", availableColors);

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
  // const avSize = new Set();
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

  const handleAddToCart = () => {
    if (!selectedSizeId || !selectedVariant) {
      toast.error("Please select a size.");
      return;
    }

    addToCart({
      cartItem: {
        shoeId: shoe.id,
        name: shoe.name,
        image: currentImages[0]?.url || "/placeholder.png",
        price: currentPrice,
        quantity: 1,
        size: selectedVariant.size.value,
        color: selectedVariant.color.name,
        variantId: selectedVariant.id,
      },
    });
  };

  const handleAddToFavorites = (shoeId: string, selectedVariantId: string) => {
    try {
      mutate({
        shoeId: shoeId,
        colorVariantId: selectedVariantId,
        userId: userInfo.id,
      });
    } catch (error: unknown) {
      toast.error("Failed to add to favorites", {
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12 font-bevellier">
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
                  ${(parseFloat(selectedVariant.salePrice) / 100).toFixed(2)}
                </p>
                <p className="text-lg text-gray-500 line-through">
                  ${(parseFloat(selectedVariant.price) / 100).toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-2xl text-gray-900">
                ${(currentPrice / 100).toFixed(2)}
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

          <div className="mt-8 flex flex-col items-center gap-4">
            <Button
              size="lg"
              className="w-full rounded-full h-full py-5 text-lg"
              disabled={
                !selectedSizeId ||
                !selectedVariant ||
                selectedVariant.inStock === 0 ||
                isPending
              }
              onClick={handleAddToCart}
            >
              {isPending ? "Adding..." : "Add to Bag"}
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="w-full rounded-full h-full py-4 border border-gray-300 text-lg"
              onClick={() => handleAddToFavorites(shoe.id, selectedVariant?.id)}
            >
              {isFavoritePending ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                "Favorite"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
