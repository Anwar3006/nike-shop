import ShoesService from "@/lib/services/shoes.service";
import { GetShoesApiResponse, ShoesQueryOptions } from "@/types/shoes";
import { useInfiniteQuery } from "@tanstack/react-query";

// const shoesQueryClient = useQueryClient();
interface UseShoesOptions
  extends Omit<ShoesQueryOptions, "pageParam" | "offset"> {
  enabled?: boolean; // Control when query runs
  staleTime?: number; // How long data stays fresh
}

export const useGetShoes = (options: UseShoesOptions) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
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
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
    enabled,
    staleTime,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
