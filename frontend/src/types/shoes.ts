// Query Options Type (for React Query)
export interface ShoesQueryOptions {
  pageParam?: number;
  limit?: string;
  offset?: string;
  sort?: string;
  gender?: string;
  size?: string;
  color?: string;
  price?: string;
}

// API Response Types
export interface Shoe {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  colors: Array<{
    name: string;
    hex: string;
  }>;
  sizes: string[];
  gender: "men" | "women" | "kids" | "unisex";
  description?: string;
  inStock?: boolean;
}

export interface Shoes {
  id: string;
  name: string;
  baseImage: string;
  category: string;
  price: number;
  colors: Array<{
    name: string;
    hex: string;
  }>;
}

export interface GetShoesApiResponse {
  data: Shoes[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasNext: boolean;
    nextPage: number | undefined;
  };
}
