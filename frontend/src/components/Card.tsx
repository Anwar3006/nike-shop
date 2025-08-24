import Image from "next/image";
import React from "react";

interface CardProps {
  imgSrc: string;
  badgeText?: string;
  name: string;
  category: string;
  price: number;
  colorCount: number;
}

const Card: React.FC<CardProps> = ({
  imgSrc,
  badgeText,
  name,
  category,
  price,
  colorCount,
}) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden bg-gray-50">
      <div className="relative">
        <Image
          className="w-full"
          src={imgSrc}
          alt={name}
          width={400}
          height={400}
          objectFit="cover"
        />
        {badgeText && (
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-md text-sm font-semibold text-red-600">
            {badgeText}
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-gray-500 text-sm">{category}</p>
        <h3 className="text-xl font-bold mt-2">{name}</h3>
        <p className="text-gray-500 text-sm mt-2">
          {colorCount} Colour{colorCount > 1 ? "s" : ""}
        </p>
        <p className="text-lg font-semibold mt-4">${price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Card;
