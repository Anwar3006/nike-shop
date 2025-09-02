export interface FavoriteItem {
  id: string;
  userId: string;
  shoeId: string;
  colorVariantId?: string;
  createdAt: string;
  // Include shoe details for display
  shoe: {
    id: string;
    name: string;
    baseImage: string;
    basePrice: number;
    categoryName: string;
  };
}

export interface AddFavoriteRequest {
  shoeId: string;
  userId: string;
}

export interface GetFavoritesResponse {
  success: boolean;
  data: FavoriteItem[];
  count: number;
}
