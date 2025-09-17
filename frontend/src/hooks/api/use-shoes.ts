import ShoesService from "@/lib/services/shoes.service";
import { GetShoesApiResponse, ShoesQueryOptions } from "@/types/shoes";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

// const shoesQueryClient = useQueryClient();
interface UseShoesOptions
  extends Omit<ShoesQueryOptions, "pageParam" | "offset"> {
  enabled?: boolean; // Control when query runs
  staleTime?: number; // How long data stays fresh
  initialData?: InfiniteData<GetShoesApiResponse>;
}

export const useGetShoes = (options: UseShoesOptions) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    initialData,
    ...queryOptions
  } = options;

  return useInfiniteQuery<GetShoesApiResponse, Error>({
    queryKey: ["shoes", queryOptions],
    queryFn: ({ pageParam = 0 }) =>
      ShoesService.getShoes({
        ...queryOptions,
        pageParam: pageParam as number,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNext) {
        return lastPage.meta.offset + lastPage.meta.limit;
      }
      return undefined;
    },
    initialData,
    enabled,
    staleTime,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
