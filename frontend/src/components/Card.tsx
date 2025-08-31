"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface CardProps {
  imgSrc: string;
  badgeText?: string;
  name: string;
  category: string;
  price: number;
  colorCount?: number;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  imgSrc,
  badgeText,
  name,
  category,
  price,
  colorCount,
  className,
}) => {
  const router = useRouter();

  const handleClick = () => {
    console.log("Card clicked");
    const slugName = name.replace(/\s+/g, "-").toLowerCase();
    const slugCategory = (
      category.split("'")[0] || category.split(" ")[0]
    ).toLowerCase();
    router.push(`/collections/${slugCategory}/${slugName}`);
  };

  const formattedPrice = Number(Math.round(price / 100)).toFixed(2);

  return (
    <div
      className={cn(
        "max-w-sm rounded-lg overflow-hidden bg-gray-50 shadow-2xs hover:shadow-xl hover:cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div className="relative">
        <Image
          className="w-full object-cover h-86 hover:scale-105 transition-transform duration-500 ease-in-out"
          src={imgSrc}
          alt={name}
          width={400}
          height={200}
        />
        {badgeText && (
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-md text-sm font-semibold text-red-600">
            {badgeText}
          </div>
        )}
      </div>

      <div className="px-3 pt-2.5 pb-2 flex flex-row justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold mt-2 font-bevellier">{name}</h3>
          <p className="text-gray-500 text-body-medium mt-0.5 font-bevellier">
            {category}
          </p>
          {colorCount !== undefined && (
            <p className="text-gray-500 font-bevellier mt-0.5 text-footnote">
              {colorCount} Colour{colorCount > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div>
          <p className="text-heading-3 font-semibold font-bevellier">
            ${formattedPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
