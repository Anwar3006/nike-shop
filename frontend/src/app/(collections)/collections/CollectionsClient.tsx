"use client";
import Sort from "@/components/Sort";
import ShoeGrid from "@/components/ShoeGrid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CollectionsClient = () => {
  const searchParams = useSearchParams();
  const resolvedSearchParams = Object.fromEntries(searchParams.entries());
  const router = useRouter();
  const pathname = usePathname();

  const handleRemoveFilter = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterKey);

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl, { scroll: false });
  };

  const activeFilters = Object.entries(resolvedSearchParams).map(
    ([key, value]) => ({
      key,
      value,
    })
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 pb-24">
        {/* Header Section - Fixed at top of content */}
        <div className="sticky top-0 bg-white z-5 pb-4 mb-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-bevellier text-heading-1">
              Shoes
            </h1>
            <Suspense fallback={<div>Loading...</div>}>
              <Sort />
            </Suspense>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map(
            (filter) =>
              filter.value && (
                <span
                  key={filter.key}
                  className="bg-gray-100 hover:bg-red-100 hover:cursor-pointer
                  transition-colors duration-300 border border-gray-300 shadow-2xs text-gray-700
                  px-3 py-1 rounded-full text-sm font-light font-bevellier"
                  onClick={() => handleRemoveFilter(filter.key)}
                >
                  {filter.key}: {filter.value}
                </span>
              )
          )}
        </div>

        {/* Products Grid */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center size-full animate-pulse">
              Loading shoes...
            </div>
          }
        >
          <ShoeGrid />
        </Suspense>
      </div>
    </div>
  );
};

export default CollectionsClient;
