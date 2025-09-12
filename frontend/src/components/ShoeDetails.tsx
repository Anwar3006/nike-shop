"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { notFound } from "next/navigation";
import { Shoe, ShoeVariant } from "@/types/shoes";
import ShoeImages from "@/components/ShoeImages";
import ShoeSizes from "@/components/ShoeSizes";
import ColorSelector from "@/components/ColorSelector";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAddToCart } from "@/hooks/cache/use-cart";
import { useIsFavorite, useToggleFavorite } from "@/hooks/api/use-favorites";
import { toast } from "sonner";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ShoeDetailsProps {
  shoe: Shoe;
}

export default function ShoeDetails({ shoe }: ShoeDetailsProps) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    shoe.variants[0]?.color.id || null
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
          pin: leftSideRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });
      return () => tl.kill();
    });
    return () => mm.revert();
  }, []);

  const uniqueColors = useMemo(() => {
    const colors = new Map<string, ShoeVariant["color"]>();
    shoe.variants.forEach((variant) => {
      if (!colors.has(variant.color.id)) {
        colors.set(variant.color.id, variant.color);
      }
    });
    return Array.from(colors.values());
  }, [shoe.variants]);

  const availableSizes = useMemo(() => {
    return shoe.variants
      .filter((variant) => variant.color.id === selectedColorId)
      .map((variant) => variant.size)
      .filter(
        (size, index, self) => self.findIndex((s) => s.id === size.id) === index
      );
  }, [shoe.variants, selectedColorId]);

  const selectedVariant = useMemo(() => {
    return shoe.variants.find(
      (v) => v.color.id === selectedColorId && v.size.id === selectedSizeId
    );
  }, [shoe.variants, selectedColorId, selectedSizeId]);

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const { data: favoriteStatus, isLoading: isFavoriteLoading } = useIsFavorite(
    shoe.id
  );
  const { toggleFavorite, isLoading: isTogglingFavorite } = useToggleFavorite();

  if (!shoe) {
    notFound();
  }

  const handleFavoriteToggle = () => {
    toggleFavorite({
      shoeId: shoe.id,
      isFavorite: favoriteStatus?.isFavorite || false,
      favoriteId: favoriteStatus?.favoriteId,
    });
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.warning("Please select a size", {
        description:
          "You need to select an available size before adding to the cart.",
      });
      return;
    }

    addToCart({
      cartItem: {
        shoeId: shoe.id,
        name: shoe.name,
        image: selectedVariant.images[0]?.url || "/placeholder.png",
        price: parseFloat(selectedVariant.price),
        quantity: 1,
        size: selectedVariant.size.value,
        color: selectedVariant.color.name,
      },
    });
  };

  const displayPrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : parseFloat(shoe.variants[0]?.price || "0");

  const displayImages =
    shoe.variants.find((v) => v.color.id === selectedColorId)?.images ||
    shoe.variants[0]?.images ||
    [];

  return (
    <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Mobile: Product Info first */}
        <div className="lg:hidden">
          <div className="space-y-4">
            <p className="text-lg text-gray-500">{shoe.category.name}</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              {shoe.name}
            </h1>
            <p className="text-2xl sm:text-3xl text-gray-900">
              ${displayPrice.toFixed(2)}
            </p>
            {/* ... rest of mobile info */}
          </div>
        </div>

        {/* Left column - Images */}
        <div
          ref={leftSideRef}
          className="lg:h-screen lg:sticky lg:top-0 flex items-center"
        >
          <div className="w-full">
            <ShoeImages images={displayImages} />
          </div>
        </div>

        {/* Right column - Content */}
        <div ref={rightSideRef} className="lg:py-16">
          <div className="space-y-8">
            {/* Desktop: Product Info */}
            <div className="hidden lg:block space-y-4">
              <p className="text-lg text-gray-500">{shoe.category.name}</p>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {shoe.name}
              </h1>
              <p className="text-3xl text-gray-900">
                ${displayPrice.toFixed(2)}
              </p>
              {/* ... rest of desktop info */}
            </div>

            <div className="space-y-6">
              <ColorSelector
                colors={uniqueColors}
                selectedColorId={selectedColorId}
                onSelectColor={(colorId) => {
                  setSelectedColorId(colorId);
                  setSelectedSizeId(null); // Reset size when color changes
                }}
                variants={shoe.variants}
              />

              <ShoeSizes
                sizes={availableSizes}
                selectedSizeId={selectedSizeId}
                onSelectSize={setSelectedSizeId}
              />
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full flex items-center justify-center gap-2 text-white bg-black hover:bg-gray-800"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !selectedVariant}
              >
                <ShoppingCart className="h-5 w-5" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-2 border-gray-300"
                onClick={handleFavoriteToggle}
                disabled={isTogglingFavorite || isFavoriteLoading}
              >
                <Heart
                  className={`h-5 w-5 ${
                    favoriteStatus?.isFavorite
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
                {isTogglingFavorite
                  ? "Updating..."
                  : favoriteStatus?.isFavorite
                  ? "Favorited"
                  : "Favorite"}
              </Button>
            </div>

            {/* Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="product-details">
                <AccordionTrigger className="text-left font-semibold">
                  Product Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-gray-700">
                    <p>{shoe.description}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              {/* ... other accordion items */}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
