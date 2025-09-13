"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { ShoeImage } from "@/types/shoes";
import { useState, useEffect } from "react";

interface ShoeImagesProps {
  images: ShoeImage[];
}

export default function ShoeImages({ images }: ShoeImagesProps) {
  const [mainImage, setMainImage] = useState(
    images.find((img) => img.isPrimary)?.url || images[0]?.url || ""
  );

  useEffect(() => {
    setMainImage(
      images.find((img) => img.isPrimary)?.url || images[0]?.url || ""
    );
  }, [images]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex p-1 lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:p-1 ">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "relative w-15 h-15 rounded-lg overflow-hidden cursor-pointer flex-shrink-0",
              mainImage === image.url && "ring-2 ring-primary"
            )}
            onClick={() => setMainImage(image.url)}
          >
            <Image
              src={image.url}
              alt={`Shoe image`}
              width={60}
              height={60}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="relative w-full h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden">
        <Image
          src={mainImage}
          alt="Main shoe image"
          fill
          sizes="100%"
          className="transition-opacity duration-500 object-cover"
        />
      </div>
    </div>
  );
}
