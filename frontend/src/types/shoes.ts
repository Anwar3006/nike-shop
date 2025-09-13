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
export interface ShoeImage {
  id: string;
  url: string;
  isPrimary: boolean;
  shoeId: string;
  variantId?: string | null;
  sortOrder: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

export interface ShoeVariant {
  id: string;
  shoeId: string;
  sku: string;
  price: string; // numeric from database comes as string
  salePrice?: string | null;
  inStock: number;
  weight?: number | null;
  dimensions?: Record<string, unknown>;
  color: {
    id: string;
    name: string;
    hex: string;
  };
  size: {
    id: string;
    value: string;
  };
  images: ShoeImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Shoe {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isPublished: boolean;
  brand: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  gender: {
    id: string;
    name: string;
  };
  variants: ShoeVariant[];
  images: ShoeImage[];
  reviews: Review[];
  defaultVariant?: ShoeVariant | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetShoesApiResponse {
  data: Shoe[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
