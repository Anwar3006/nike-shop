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
import { Star, Heart } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const rightContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mm = gsap.matchMedia();
    let resizeObserver: ResizeObserver | null = null;

    mm.add("(min-width: 1024px)", () => {
      const container = containerRef.current;
      const leftSide = leftSideRef.current;
      const rightSide = rightSideRef.current;
      const rightContent = rightContentRef.current;

      if (!container || !leftSide || !rightSide || !rightContent) {
        return;
      }

      const setupScrollTrigger = () => {
        const rightContentHeight = rightContent.scrollHeight;
        const rightSideHeight = rightSide.clientHeight;
        const scrollDistance = rightContentHeight - rightSideHeight;

        if (scrollDistance > 50) {
          // Clear old triggers
          ScrollTrigger.getAll().forEach((trigger) => {
            if (
              trigger.vars?.id === "shoe-details-pin" ||
              trigger.vars?.id === "shoe-details-scroll"
            ) {
              trigger.kill();
            }
          });

          const containerHeight = window.innerHeight + scrollDistance + 100;
          gsap.set(container, { height: containerHeight });

          ScrollTrigger.create({
            id: "shoe-details-pin",
            trigger: container,
            start: "top top",
            end: `+=${scrollDistance + 50}`,
            pin: leftSide,
            pinSpacing: false,
            anticipatePin: 1,
          });

          ScrollTrigger.create({
            id: "shoe-details-scroll",
            trigger: container,
            start: "top top",
            end: `+=${scrollDistance + 50}`,
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              rightSide.scrollTop = progress * scrollDistance;
            },
          });
        }
      };

      // Use ResizeObserver to detect content size changes
      resizeObserver = new ResizeObserver(() => {
        // Recalculate ScrollTrigger when right-side content size changes
        setupScrollTrigger();
      });

      resizeObserver.observe(rightContent);

      // Initial setup
      setupScrollTrigger();
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mm?.revert();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  if (!shoe) {
    notFound();
  }

  const selectedColor = shoe.colors.find(
    (c) => c.styleNumber === selectedColorStyle
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column - Images (will be pinned on lg screens) */}
          <div
            ref={leftSideRef}
            className="lg:h-screen lg:flex lg:items-center"
          >
            <div className="w-full">
              <ShoeImages shoe={shoe} selectedColorStyle={selectedColorStyle} />
            </div>
          </div>

          {/* Right column - Scrollable content */}
          <div ref={rightSideRef} className="lg:h-screen lg:overflow-hidden">
            <div
              ref={rightContentRef}
              className="lg:h-full lg:overflow-y-auto lg:px-4 space-y-8"
              style={{
                // Remove default scrollbar on lg screens for cleaner look
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Hide scrollbar on webkit browsers */}
              <style jsx>{`
                @media (min-width: 1024px) {
                  div::-webkit-scrollbar {
                    display: none;
                  }
                }
              `}</style>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                    {shoe.name}
                  </h1>
                  <p className="text-lg text-gray-500 mt-1">Women's Shoes</p>
                  <p className="text-2xl text-gray-900 mt-2">
                    ${shoe.basePrice / 100}
                  </p>
                  <div className="text-green-600 text-sm font-medium mt-1">
                    Extra 20% off w/ code SPORT
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
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full text-white bg-black hover:bg-gray-800"
                >
                  Add to Bag
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2 border-gray-300"
                >
                  <Heart className="h-4 w-4" />
                  Favorite
                </Button>
              </div>

              {/* Accordion */}
              <div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="product-details">
                    <AccordionTrigger className="text-left font-semibold">
                      Product Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-gray-700">
                        <p>
                          The Air Max 90 stays true to its running roots with
                          the iconic Waffle sole. Plus, stitched overlays and
                          textured accents create the '90s look you love.
                          Complete with romantic hues, its visible Air
                          cushioning adds comfort to your journey.
                        </p>
                        <ul className="space-y-2 mt-4">
                          <li>• Padded collar</li>
                          <li>• Foam midsole</li>
                          <li>
                            • Shown:{" "}
                            {selectedColor?.name ||
                              "Dark Team Red/Platinum Tint/Pure Platinum/White"}
                          </li>
                          <li>
                            • Style:{" "}
                            {selectedColor?.styleNumber || "HM9451-600"}
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
                            Items must be in original condition with tags
                            attached.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="reviews">
                    <AccordionTrigger className="text-left font-semibold flex items-center gap-2">
                      <span>Reviews (10)</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
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
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <span className="font-medium text-sm">
                                Sarah M.
                              </span>
                              <span className="text-xs text-gray-500">
                                • 2 days ago
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">
                              "Love these sneakers! The color is exactly as
                              pictured and they're super comfortable for all-day
                              wear. The Air Max cushioning really makes a
                              difference."
                            </p>
                          </div>

                          {/* Review 2 */}
                          <div className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <span className="font-medium text-sm">
                                Mike J.
                              </span>
                              <span className="text-xs text-gray-500">
                                • 1 week ago
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">
                              "Great quality and fast shipping. These Air Max
                              90s are a classic for a reason! Fit true to size."
                            </p>
                          </div>

                          {/* Review 3 */}
                          <div className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <span className="font-medium text-sm">
                                Emma R.
                              </span>
                              <span className="text-xs text-gray-500">
                                • 2 weeks ago
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">
                              "These are my new favorite sneakers! The retro
                              style is perfect and they go with everything.
                              Highly recommend!"
                            </p>
                          </div>

                          {/* Review 4 */}
                          <div className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <span className="font-medium text-sm">
                                David L.
                              </span>
                              <span className="text-xs text-gray-500">
                                • 3 weeks ago
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">
                              "Excellent build quality and super comfortable.
                              The colorway is beautiful and gets lots of
                              compliments."
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Additional content to demonstrate scrolling */}
              <div className="space-y-6 pt-8">
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold mb-4">Size & Fit</h3>
                  <div className="space-y-3 text-gray-700 text-sm">
                    <p>• Fits true to size</p>
                    <p>• Narrow to medium width</p>
                    <p>• Lace closure provides secure fit</p>
                    <p>• Padded collar for comfort</p>
                  </div>
                </div>

                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Care Instructions
                  </h3>
                  <div className="space-y-3 text-gray-700 text-sm">
                    <p>• Wipe clean with damp cloth</p>
                    <p>• Air dry only</p>
                    <p>• Store in cool, dry place</p>
                    <p>• Avoid direct sunlight when drying</p>
                  </div>
                </div>

                <div className="pb-8">
                  <h3 className="text-lg font-semibold mb-4">
                    About Nike Air Max
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Nike Air Max shoes feature Nike's signature Air cushioning
                    for all-day comfort. The Air Max line has been a cornerstone
                    of Nike's footwear since 1987, combining performance
                    technology with iconic street style. Each pair is designed
                    to provide maximum comfort and style for your active
                    lifestyle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
