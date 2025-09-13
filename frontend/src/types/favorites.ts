import { Shoe } from "./shoes";

export interface FavoriteItem {
  id: string;
  userId: string;
  shoeId: string;
  colorVariantId?: string;
  createdAt: string;
  shoe: Shoe;
}

export interface AddFavoriteRequest {
  shoeId: string;
  userId: string;
  colorVariantId?: string;
}

export interface GetFavoritesResponse {
  success: boolean;
  data: FavoriteItem[];
  count: number;
}
