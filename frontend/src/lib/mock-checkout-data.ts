export type CartItemData = {
  shoeId: string;
  name: string;
  image: string;
  color: string;
  price: number;
  quantity: number;
  size: string;
};

export const mockCartItems: CartItemData[] = [
  {
    shoeId: "1",
    name: "Nike Air Max 270",
    image: "/shoes/shoe-1.jpg", // Using existing shoe images
    color: "Gray",
    price: 499.99,
    quantity: 1,
    size: "10",
  },
  {
    shoeId: "2",
    name: "Nike React Infinity Run Flyknit",
    image: "/shoes/shoe-2.webp",
    color: "White",
    price: 99.99,
    quantity: 1,
    size: "9.5",
  },
];

export const mockRecommendedItem = {
  id: "3",
  name: "Nike ZoomX Invincible Run Flyknit",
  image: "/shoes/shoe-3.webp",
  price: 180.0,
  originalPrice: 220.0,
  description:
    "Dive into a world of unrivaled gaming experiences with PlayStation VR2.",
};
