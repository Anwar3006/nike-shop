import Card from "@/components/Card";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const dummyData = [
  {
    imgSrc: "/shoes/shoe-1.jpg",
    badgeText: "Best Seller",
    name: "Nike Air Force 1 '07",
    category: "Men's Shoe",
    price: 98.3,
    colorCount: 4,
  },
  {
    imgSrc: "/shoes/shoe-2.webp",
    badgeText: "Extra 20% off",
    name: "Nike Court Vision Low Next Nature",
    category: "Women's Shoe",
    price: 98.3,
    colorCount: 2,
  },
  {
    imgSrc: "/shoes/shoe-3.webp",
    name: "Nike Dunk Low Retro",
    category: "Men's Shoe",
    price: 98.3,
    colorCount: 6,
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container mx-auto px-6 py-8">
        <h1 className="font-bevellier text-heading-2-medium font-bold mb-8">
          Featured Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyData.map((card) => (
            <Card
              id={"123"}
              key={card.name}
              imgSrc={card.imgSrc}
              badgeText={card.badgeText}
              name={card.name}
              category={card.category}
              price={card.price}
              colorCount={card.colorCount}
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
            src="/shoes/shoe-1.jpg"
            alt="Nike Air Force 1 '07"
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-0 left-0 bg-red px-4 py-2">
            <h1 className="font-bevellier text-2xl font-bold mb-3 text-white">
              Trending Products
            </h1>
          </div>

          <div className="absolute top-2/10 left-4 max-w-md">
            <h2 className="font-bold text-white mb-2 font-bevellier text-heading-2">
              Nike Air Force 1 &apos;07
            </h2>
            <p className="text-2xl text-white font-bevellier">
              Men&apos;s Shoe
            </p>
            <Button className="mt-4 p-4 bg-white text-black font-bevellier text-2xl! rounded-full">
              Shop Now
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:block px-8 py-4">
        <div className="grid grid-cols-2 w-full gap-8">
          <TrendingCard />
          <TrendingCard />
        </div>
      </div>
    </section>
  );
};

const TrendingCard = ({
  title,
  imgUrl,
}: {
  title?: string;
  imgUrl?: string;
}) => {
  return (
    <div className="max-h-96 relative">
      <Image
        src={imgUrl || "/shoes/shoe-1.jpg"}
        alt={title || "Nike Air Force 1 '07"}
        width={400}
        height={400}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      <div className="absolute bottom-0 left-0 p-4">
        <p className="text-white mb-2 font-bevellier text-lead text-3xl">
          {title || "Nike Air Force 1 '07"}
        </p>
      </div>
    </div>
  );
};
