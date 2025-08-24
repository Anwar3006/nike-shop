import Card from "@/components/Card";

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
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Featured Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyData.map((card) => (
          <Card
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
  );
}
