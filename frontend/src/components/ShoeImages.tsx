"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Shoe } from "@/types/shoes";
import { useState, useEffect } from "react";

interface ShoeImagesProps {
  shoe: Shoe;
  selectedColorStyle: string;
}

export default function ShoeImages({
  shoe,
  selectedColorStyle,
}: ShoeImagesProps) {
  const selectedColor = shoe.colors.find(
    (c) => c.styleNumber === selectedColorStyle
  );

  const [mainImage, setMainImage] = useState(
    selectedColor?.images[0] || shoe.baseImage
  );

  useEffect(() => {
    const newMainImage =
      shoe.colors.find((c) => c.styleNumber === selectedColorStyle)
        ?.images[0] || shoe.baseImage;
    setMainImage(newMainImage);
  }, [selectedColorStyle, shoe]);

  const activeImages = selectedColor?.images || [];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:p-1 ">
        {activeImages.map((url, index) => (
          <div
            key={index}
            className={cn(
              "relative w-15 h-15 rounded-lg overflow-hidden cursor-pointer flex-shrink-0",
              mainImage === url && "ring-2 ring-primary"
            )}
            onClick={() => setMainImage(url)}
          >
            <Image
              src={url}
              alt={`Shoe image ${index + 1}`}
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
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-500"
        />
      </div>
    </div>
  );
}
