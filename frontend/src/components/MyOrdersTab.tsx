import OrderItem from "./OrderItem";

// Dummy data for orders
const orders = [
  {
    status: "Estimated arrival" as const,
    date: "24 Sep 2025",
    imageUrl: "/shoes/shoe-1.jpg", // Placeholder image
    name: "Nike Air Force 1 Mid '07",
    category: "Men's Shoes",
    size: 10,
    quantity: 2,
    price: 98.3,
  },
  {
    status: "Delivered" as const,
    date: "04 August",
    imageUrl: "/shoes/shoe-6.avif", // Placeholder image
    name: "Air Max 1 '86 Original",
    category: "Men's Shoes",
    size: 10,
    quantity: 2,
    price: 104.26,
  },
  {
    status: "Delivered" as const,
    date: "04 August",
    imageUrl: "/shoes/shoe-9.avif", // Placeholder image
    name: "Nike Air Force 1 Low Retro",
    category: "Men's Shoes",
    size: 8,
    quantity: 1,
    price: 185.67,
  },
];

const MyOrdersTab = () => {
  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <OrderItem key={index} {...order} />
      ))}
    </div>
  );
};

export default MyOrdersTab;
