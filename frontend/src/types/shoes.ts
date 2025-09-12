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
  sortOrder: number;
  isPrimary: boolean;
}

export interface ShoeVariant {
  id: string;
  sku: string;
  price: string;
  salePrice: string | null;
  inStock: number;
  color: {
    id: string;
    name: string;
    hexCode: string;
  };
  size: {
    id: string;
    value: string;
  };
  images: ShoeImage[];
}

export interface Shoe {
  id: string;
  name: string;
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
