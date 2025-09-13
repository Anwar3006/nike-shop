"use client";
import React, { useMemo } from "react";
import Card from "./Card";
import { useGetShoes } from "@/hooks/api/use-shoes";
import { useSearchParams } from "next/navigation";
import ShoesSkeleton from "./ShoesSkeleton";
import Error from "./Error";
import { Button } from "./ui/button";

const ShoeGrid = () => {
  const searchParams = useSearchParams();

  // Build query options from URL params
  const queryOptions = {
    sort: searchParams.get("sort") || undefined,
    gender: searchParams.get("gender") || undefined,
    size: searchParams.get("size") || undefined,
    color: searchParams.get("color") || undefined,
    price: searchParams.get("price") || undefined,
    category: searchParams.get("category") || undefined,
    limit: "6", // Items per page
  };

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetShoes(queryOptions);

  const allShoes = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data]
  );

  const colors = useMemo(
    () =>
      allShoes.map((shoe) => {
        const tempSet = new Set();
        const tempMap = new Map();
        shoe.variants.forEach((variant) => {
          if (variant.color) {
            tempSet.add(variant.color.name);
          }
        });
        tempMap.set(shoe.id, Array.from(tempSet));
        return tempMap;
      }),
    [allShoes]
  );

  if (isLoading) {
    return <ShoesSkeleton length={6} />;
  }

  if (isError) {
    return <Error title="Shoes" error={error} />;
  }

  console.log("colors: ", colors);
  console.log("allshoes: ", allShoes);
  return (
    <div className="gap-y-4">
      {allShoes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allShoes.map((product) => {
            const primaryImage =
              product.variants
                .flatMap((v) => v.images)
                .find((img) => img.isPrimary)?.url ||
              product.variants[0]?.images[0]?.url ||
              "/placeholder.png";

            const price = product.variants[0]?.price
              ? parseFloat(product.variants[0].price)
              : 0;

            return (
              <div key={product.id} className="flex justify-center">
                <Card
                  id={product.id}
                  imgSrc={primaryImage}
                  name={product.name}
                  category={product.category.name}
                  price={price}
                  colorCount={
                    colors.find((c) => c.has(product.id))?.get(product.id)
                      ?.length
                  }
                  className="w-full max-w-sm"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2 font-bevellier">
            No shoes found
          </h2>
          <p className="text-gray-500 font-bevellier">
            Try adjusting your filters to find what you&apos;re looking for.
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center mt-16">
          <Button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="hover:cursor-pointer hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-bevellier"
          >
            {isFetchingNextPage ? "Loading..." : "Load More Shoes"}
          </Button>
        </div>
      )}

      {/* Total Count */}
      <div className="text-center text-gray-500 font-bevellier mt-3">
        Showing {allShoes.length} of {data?.pages[0]?.meta.total || 0} shoes
      </div>
    </div>
  );
};

export default ShoeGrid;
