"use client";
import { useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { Shoe } from "@/types/shoes";
import NewShoeImages from "@/components/NewShoeImages";
import ShoeSizes from "@/components/ShoeSizes";
import ColorSelector from "@/components/ColorSelector";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/cache/use-cart";
import { toast } from "sonner";
import { Heart, Loader2, ShoppingCart, Star } from "lucide-react";
import { useAddFavorite } from "@/hooks/api/use-favorites";
import { useGetUserInfo } from "@/hooks/api/use-userInfo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ShoeDetailsProps {
  shoe: Shoe;
}

export default function ShoeDetails({ shoe }: ShoeDetailsProps) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const { mutate, isPending: isFavoritePending } = useAddFavorite();
  const { data: userInfo } = useGetUserInfo();

  const availableColors = useMemo(() => {
    const colorsMap = new Map();
    shoe.variants.forEach((variant) => {
      if (variant.color && !colorsMap.has(variant.color.id)) {
        colorsMap.set(variant.color.id, variant.color);
      }
    });
    return Array.from(colorsMap.values());
  }, [shoe.variants]);

  const [selectedColorId, setSelectedColorId] = useState<string>(
    shoe.defaultVariant?.color?.id || availableColors[0]?.id || ""
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

  if (!shoe) {
    notFound();
  }

  const selectedColorVariants = shoe.variants.filter(
    (variant) => variant.color.id === selectedColorId
  );

  const availableSizes = selectedColorVariants.map((variant) => variant.size);

  const selectedVariant =
    selectedColorVariants.find(
      (variant) => variant.size.id === selectedSizeId
    ) || selectedColorVariants[0];

  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.salePrice || selectedVariant.price)
    : parseFloat(shoe.variants[0]?.price || "0");

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

  const averageRating =
    shoe.reviews?.length > 0
      ? shoe.reviews.reduce((acc, review) => acc + review.rating, 0) /
        shoe.reviews.length
      : 0;

  const percentageOff =
    selectedVariant?.salePrice &&
    parseFloat(selectedVariant.salePrice) < parseFloat(selectedVariant.price)
      ? (
          (parseInt(selectedVariant.salePrice) /
            parseInt(selectedVariant.price)) *
          100
        ).toFixed(2)
      : null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 font-bevellier">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <NewShoeImages images={currentImages} isHighlyRated={true} />

        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            {shoe.name}
          </h1>
          <p className="text-lg text-gray-500 mt-1">
            {shoe.category.name}&apos;s Shoes
          </p>

          <div className="mt-4">
            {selectedVariant?.salePrice &&
            parseFloat(selectedVariant.salePrice) <
              parseFloat(selectedVariant.price) ? (
              <div className="flex items-center gap-2">
                <p className="text-3xl text-red-600 font-semibold">
                  ${(parseFloat(selectedVariant.salePrice) / 100).toFixed(2)}
                </p>
                <p className="text-xl text-gray-500 line-through">
                  ${(parseFloat(selectedVariant.price) / 100).toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-3xl text-gray-900">
                ${(currentPrice / 100).toFixed(2)}
              </p>
            )}
            {percentageOff ? (
              <p className="text-sm text-green-600 font-semibold mt-1">
                Extra {percentageOff}% off. Grab while they last.
              </p>
            ) : (
              <div className="mt-1 h-5" />
            )}
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Select Size</h3>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Size Guide
              </a>
            </div>
            <ShoeSizes
              sizes={availableSizes}
              selectedSizeId={selectedSizeId}
              onSelectSize={setSelectedSizeId}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4">
            <Button
              size="lg"
              className="w-full rounded-full h-14 text-lg flex items-center gap-2"
              disabled={
                !selectedSizeId ||
                !selectedVariant ||
                selectedVariant.inStock === 0 ||
                isPending
              }
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} />
              {isPending ? "Adding..." : "Add to Bag"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-full h-14 text-lg"
              onClick={() => handleAddToFavorites(shoe.id, selectedVariant?.id)}
            >
              <Heart size={20} />
              {isFavoritePending ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                "Favorite"
              )}
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full mt-8">
            <AccordionItem value="item-1">
              <AccordionTrigger>Product Details</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">{shoe.description}</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Padded collar</li>
                  <li>Foam midsole</li>
                  <li>Shown: {selectedVariant?.color.name}</li>
                  <li>
                    Style:{" "}
                    {shoe.defaultVariant?.sku.split("-")[0].toUpperCase()}
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                Free standard shipping and free 60-day returns.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Reviews ({shoe.reviews?.length || 0})
              </AccordionTrigger>
              <AccordionContent>
                {shoe.reviews?.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= averageRating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600">
                        {averageRating.toFixed(1)} out of 5
                      </span>
                    </div>
                    <div>
                      {shoe.reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="border-t py-4">
                          <div className="flex items-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-800">{review.comment}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            - {review.user.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>No reviews yet.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
