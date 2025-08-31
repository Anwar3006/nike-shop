import SearchService from "@/lib/services/search.service";
import {
  AutocompleteApiResponse,
  PopularSearchesApiResponse,
  SearchApiResponse,
  SearchHistoryApiResponse,
} from "@/types/search";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

interface UseSearchOptions {
  query: string;
  enabled?: boolean;
  userId?: string;
}

export const useSearch = ({ query, enabled = true }: UseSearchOptions) => {
  return useInfiniteQuery<SearchApiResponse, Error>({
    queryKey: ["search", query],
    queryFn: ({ pageParam = 0 }) =>
      SearchService.getSearchResults(query, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage,
    enabled: enabled && !!query,
  });
};

export const useAutocomplete = (query: string) => {
  return useQuery<AutocompleteApiResponse, Error>({
    queryKey: ["autocomplete", query],
    queryFn: () => SearchService.getAutocompleteSuggestions(query),
    enabled: !!query,
  });
};

export const useSearchHistory = (userId: string) => {
  return useQuery<SearchHistoryApiResponse, Error>({
    queryKey: ["searchHistory"],
    queryFn: () => SearchService.getSearchHistory(userId),
  });
};

export const usePopularSearches = () => {
  return useQuery<PopularSearchesApiResponse, Error>({
    queryKey: ["popularSearches"],
    queryFn: () => SearchService.getPopularSearches(),
  });
};

export const useRecordClick = () => {
  return useMutation<void, Error, { query_id: string; product_id: string }>({
    mutationFn: ({ query_id, product_id }) =>
      SearchService.recordClick(query_id, product_id),
  });
};
