"use client";

import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/api/use-search";
import Card from "@/components/Card";
import ShoesSkeleton from "@/components/ShoesSkeleton";
import Error from "@/components/Error";
import { Button } from "@/components/ui/button";
import React from "react";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearch({ query, enabled: !!query });

  const allShoes = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-bevellier">
          {query ? `Search Results for "${query}"` : "Search"}
        </h1>
        {query && !isLoading && (
          <p className="text-gray-500 mt-2">
            Showing {allShoes.length} of {data?.pages[0]?.meta.total || 0} results
          </p>
        )}
      </div>

      {isLoading && <ShoesSkeleton length={6} />}
      {isError && <Error title="Search Results" error={error} />}

      {!isLoading && !isError && (
        <>
          {allShoes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allShoes.map((product) => (
                <div key={product.id} className="flex justify-center">
                  <Card
                    imgSrc={product.baseImage}
                    name={product.name}
                    category={product.category}
                    price={product.basePrice}
                    // colorCount={product.colors.length}
                    className="w-full max-w-sm"
                  />
                </div>
              ))}
            </div>
          ) : (
            query && (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-2 font-bevellier">
                  No shoes found for &quot;{query}&quot;
                </h2>
                <p className="text-gray-500 font-bevellier">
                  Try a different search term or check your spelling.
                </p>
              </div>
            )
          )}

          {hasNextPage && (
            <div className="flex justify-center mt-16">
              <Button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="hover:cursor-pointer hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-bevellier"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

//This is required to make search params available in the page component
const SearchPageWithSuspense = () => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <SearchPage />
  </React.Suspense>
);

export default SearchPageWithSuspense;
