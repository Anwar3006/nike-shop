export interface CartItem {
  itemKey: string;
  shoeId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string | null;
  addedAt: number;
}

export interface AddToCartParams {
  shoeId: string;
  name: string;
  image: string;
  price: number;
  quantity?: number;
  size: string;
  color?: string;
}
