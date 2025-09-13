export interface CartItem {
  shoeId: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string | undefined;
  addedAt: number;
}

export interface AddToCartParams {
  shoeId: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  quantity?: number;
  size: string;
  color?: string;
}
