import { Shoe } from "./shoes";

// export interface SearchResult extends Shoe {}

export interface SearchHistory {
  query: string;
}

export interface PopularSearch {
  id: number;
  query: string;
  search_count: number;
}

export interface SearchApiResponse {
  success: boolean;
  data: Shoe[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasNext: boolean;
    nextPage?: number;
  };
}

export interface AutocompleteApiResponse {
  success: boolean;
  data: string[];
}

export interface SearchHistoryApiResponse {
  success: boolean;
  data: SearchHistory[];
}

export interface PopularSearchesApiResponse {
  success: boolean;
  data: PopularSearch[];
}
