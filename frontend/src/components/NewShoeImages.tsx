"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { ShoeImage } from "@/types/shoes";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface NewShoeImagesProps {
  images: ShoeImage[];
  isHighlyRated?: boolean;
}

export default function NewShoeImages({
  images,
  isHighlyRated,
}: NewShoeImagesProps) {
  const [mainImage, setMainImage] = useState(
    images.find((img) => img.isPrimary)?.url || images[0]?.url || ""
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const primaryImageIndex = images.findIndex((img) => img.isPrimary);
    const initialIndex = primaryImageIndex !== -1 ? primaryImageIndex : 0;
    setCurrentIndex(initialIndex);
    setMainImage(images[initialIndex]?.url || "");
  }, [images]);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setMainImage(images[nextIndex].url);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setMainImage(images[prevIndex].url);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:h-[500px] p-1">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer flex-shrink-0",
              mainImage === image.url && "ring-2 ring-primary"
            )}
            onClick={() => {
              setMainImage(image.url);
              setCurrentIndex(index);
            }}
          >
            <Image
              src={image.url}
              alt={`Shoe image thumbnail ${index + 1}`}
              fill
              sizes="(max-width: 768px) 10vw, (max-width: 1200px) 5vw, 5vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden">
        {isHighlyRated && (
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-black px-3 py-1 rounded-full flex items-center gap-1 text-sm z-10">
            <Star className="w-4 h-4" />
            <span>Highly Rated</span>
          </div>
        )}
        <Image
          src={mainImage}
          alt="Main shoe image"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          className="transition-opacity duration-500 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button
            onClick={handlePrev}
            className="hidden lg:flex bg-white/50 hover:bg-white/80 rounded-full p-2 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="hidden lg:flex bg-white/50 hover:bg-white/80 rounded-full p-2 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
