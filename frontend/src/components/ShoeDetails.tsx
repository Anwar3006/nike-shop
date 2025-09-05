"use client";
import { useState, useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { Shoe } from "@/types/shoes";
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

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ShoeDetailsProps {
  shoe: Shoe;
}

export default function ShoeDetails({ shoe }: ShoeDetailsProps) {
  const [selectedColorStyle, setSelectedColorStyle] = useState(
    shoe.colors[0].styleNumber
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Refs for GSAP ScrollTrigger
  const containerRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const leftSide = leftSideRef.current;
      const rightSide = rightSideRef.current;

      if (!leftSide || !rightSide) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
          pin: leftSide,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });

      return () => {
        tl.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  if (!shoe) {
    notFound();
  }

  const selectedColor = shoe.colors.find(
    (c) => c.styleNumber === selectedColorStyle
  );

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const { data: favoriteStatus, isLoading: isFavoriteLoading } = useIsFavorite(
    shoe.id
  );
  const { toggleFavorite, isLoading: isTogglingFavorite } = useToggleFavorite();

  const handleFavoriteToggle = () => {
    toggleFavorite({
      shoeId: shoe.id,
      isFavorite: favoriteStatus?.isFavorite || false,
      favoriteId: favoriteStatus?.favoriteId,
    });
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.warning("Please select a size", {
        description: "You need to select a size before adding to the cart.",
      });
      return;
    }

    if (!selectedColor) {
      toast.error("Color not found", {
        description: "Could not find the selected color details.",
      });
      return;
    }

    addToCart({
      cartItem: {
        shoeId: shoe.id,
        name: shoe.name,
        image: selectedColor.images[0] || shoe.baseImage,
        price: shoe.basePrice / 100,
        quantity: 1,
        size: selectedSize,
        color: selectedColor.dominantColor,
      },
    });
  };

  return (
    <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Mobile: Product Info first */}
        <div className="lg:hidden">
          <div className="space-y-4">
            <p className="text-lg text-gray-500">Women's Shoes</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              {shoe.name}
            </h1>
            <p className="text-2xl sm:text-3xl text-gray-900">
              ${shoe.basePrice / 100}
            </p>
            <div className="text-green-600 text-sm font-medium">
              Extra 20% off w/ code SPORT
            </div>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(Highly Rated)</span>
            </div>
          </div>
        </div>

        {/* Left column - Images */}
        <div
          ref={leftSideRef}
          className="lg:h-screen lg:sticky lg:top-0 flex items-center"
        >
          <div className="w-full">
            <ShoeImages shoe={shoe} selectedColorStyle={selectedColorStyle} />
          </div>
        </div>

        {/* Right column - Content */}
        <div ref={rightSideRef} className="lg:py-16">
          <div className="space-y-8">
            {/* Desktop: Product Info */}
            <div className="hidden lg:block space-y-4">
              <p className="text-lg text-gray-500">Women's Shoes</p>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {shoe.name}
              </h1>
              <p className="text-3xl text-gray-900">${shoe.basePrice / 100}</p>
              <div className="text-green-600 text-sm font-medium">
                Extra 20% off w/ code SPORT
              </div>
              <div className="flex items-center gap-2 pt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(Highly Rated)</span>
              </div>
            </div>

            <div className="space-y-6">
              <ColorSelector
                colors={shoe.colors}
                selectedColorStyle={selectedColorStyle}
                onSelectColor={setSelectedColorStyle}
              />

              <ShoeSizes
                sizes={selectedColor?.size || []}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full flex items-center justify-center gap-2 text-white bg-black hover:bg-gray-800"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
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
                    <p>
                      The Air Max 90 stays true to its running roots with the
                      iconic Waffle sole. Plus, stitched overlays and textured
                      accents create the '90s look you love. Complete with
                      romantic hues, its visible Air cushioning adds comfort to
                      your journey.
                    </p>
                    <ul className="space-y-2 mt-4 list-disc list-inside">
                      <li>Padded collar</li>
                      <li>Foam midsole</li>
                      <li>
                        Shown:{" "}
                        {selectedColor?.name ||
                          "Dark Team Red/Platinum Tint/Pure Platinum/White"}
                      </li>
                      <li>
                        Style: {selectedColor?.styleNumber || "HM9451-600"}
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping-returns">
                <AccordionTrigger className="text-left font-semibold">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Shipping
                      </h4>
                      <p>
                        Standard shipping: 3-7 business days
                        <br />
                        Express shipping: 1-3 business days
                        <br />
                        Free shipping on orders over $50
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Returns
                      </h4>
                      <p>
                        Free returns within 60 days of purchase.
                        <br />
                        Items must be in original condition with tags attached.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="reviews">
                <AccordionTrigger className="text-left font-semibold flex items-center w-full">
                  <div className="flex items-center gap-2">
                    <span>Reviews (10)</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        5.0 out of 5 stars (10 reviews)
                      </span>
                    </div>

                    <div className="space-y-6">
                      {/* Review 1 */}
                      <div className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="font-medium text-sm">Sarah M.</span>
                          <span className="text-xs text-gray-500">
                            • 2 days ago
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          "Love these sneakers! The color is exactly as pictured
                          and they're super comfortable for all-day wear. The
                          Air Max cushioning really makes a difference."
                        </p>
                      </div>

                      {/* Review 2 */}
                      <div className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="font-medium text-sm">Mike J.</span>
                          <span className="text-xs text-gray-500">
                            • 1 week ago
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          "Great quality and fast shipping. These Air Max 90s
                          are a classic for a reason! Fit true to size."
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
