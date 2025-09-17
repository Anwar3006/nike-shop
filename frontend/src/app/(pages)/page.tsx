"use client";
import Card from "@/components/Card";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { useGetShoes } from "@/hooks/api/use-shoes";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const trending = {
  main: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/10502a195181539.66096ad898121.gif",

  left: [
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/8f5f8e120351127.60afbd4f38836.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/fs/449608232283721.6899b08c43cfb.jpg",
    "https://bowtiesandbones.com/wp-content/uploads/2016/03/2016-03-21-12-28-01-1.jpg",
  ],
  right: [
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/d8c0b6232283721.6899b08c45819.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/hd_webp/4c1a59232283721.6899b08c43675.jpg",
    "https://s1.dswcdn.com/uploads/Nike_Air_Force_Shoes/Air_Force_1_Low/Nike_Air_Force_1_07_Low_Landscape_Ink_Painting_White_Black_BL1522-089_P2.jpg",
  ],
};

export default function Home() {
  const { data, isPending } = useGetShoes({ limit: "3" });

  const shoes = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data]
  );
  const colors = useMemo(
    () =>
      shoes.map((shoe) => {
        const tempSet = new Set();
        const tempMap = new Map();
        shoe.variants.forEach((variant) => {
          if (variant.color) {
            tempSet.add(variant.color.name);
          }
        });
        tempMap.set(shoe.id, Array.from(tempSet));
        return tempMap;
      }),
    [shoes]
  );

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 size={48} className="animate-spin" />{" "}
      </div>
    );
  }

  return (
    <>
      <Hero />
      <div className="container mx-auto px-6 py-8">
        <h1 className="font-bevellier text-heading-2-medium font-bold mb-8">
          Featured Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shoes.map((shoe) => (
            <Card
              key={shoe.id}
              id={shoe.id}
              imgSrc={
                shoe.variants
                  .flatMap((v) => v.images)
                  .find((img) => img.isPrimary)?.url ||
                shoe.variants[0]?.images[0]?.url ||
                "/placeholder.png"
              }
              name={shoe.name}
              category={shoe.category.name}
              price={
                shoe.variants[0]?.price ? parseFloat(shoe.variants[0].price) : 0
              }
              colorCount={
                colors.find((c) => c.has(shoe.id))?.get(shoe.id)?.length
              }
            />
          ))}
        </div>
      </div>

      <Trending />
    </>
  );
}

const Trending = () => {
  return (
    <section className="col-span-2 mx-auto py-8">
      <div className="grid grid-cols-1 w-full gap-8">
        <div className="max-h-[30rem] relative">
          <Image
            alt="trending"
            src={trending.main}
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-0 left-0 bg-red px-4 py-1 md:py-2">
            <h1 className="font-bevellier text-lg md:text-2xl font-bold mb-3 text-white">
              Trending Products
            </h1>
          </div>

          <div className="absolute top-2/10 left-4 max-w-md">
            <h2 className="font-bold mb-0 lg:mb-2 font-bevellier md:text-4xl lg:text-heading-2 text-base">
              Nike Air Force 1 &apos;07
            </h2>
            <p className="text-sm lg:text-2xl font-bevellier">
              Men&apos;s Shoe
            </p>
            <Button className="mt-4 px-6 py-3 lg:px-8 lg:py-4 bg-gray-800 text-white font-bevellier text-xs lg:text-xl rounded-full hover:bg-gray-700 transition-colors">
              Shop Now
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:block px-8 py-4">
        <div className="grid grid-cols-2 w-full gap-8">
          <TrendingCard imgUrls={trending.left} />
          <TrendingCard imgUrls={trending.right} />
        </div>
      </div>
    </section>
  );
};

const TrendingCard = ({
  title,
  imgUrls,
}: {
  title?: string;
  imgUrls: string[];
}) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Don't start timer if only one image
    if (imgUrls.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % imgUrls.length);
    }, 9000); // Change image every 9 seconds

    return () => clearInterval(timer);
  }, [imgUrls.length]); // Add dependency

  // Early return with proper check
  if (!imgUrls || imgUrls.length === 0) {
    return (
      <div className="max-h-96 flex items-center justify-center bg-gray-100">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="max-h-96 relative overflow-hidden rounded-2xl">
      <div className="relative w-full h-96">
        {imgUrls.map((imgUrl, index) => (
          <Image
            key={`${imgUrl}-${index}`} // Better key using URL + index
            src={imgUrl || "/shoes/shoe-1.jpg"}
            alt={title || "Nike Air Force 1 '07"}
            fill
            className={`absolute inset-0 transition-opacity duration-1000 w-full h-full object-cover 
              ${index === currentImage ? "opacity-100" : "opacity-0"}
            `}
            priority={index === 0}
          />
        ))}
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
      {/* Text content */}
      <div className="absolute bottom-0 left-0 p-4 z-10">
        {" "}
        {/* Add z-index */}
        <p className="text-white mb-2 font-bevellier text-3xl leading-tight">
          {title || ""}
        </p>
      </div>
    </div>
  );
};
