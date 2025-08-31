"use client";
import { usePopularSearches } from "@/hooks/api/use-search";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";

const PopularSearches = () => {
  const { data, isLoading, isError } = usePopularSearches();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading popular searches...</span>
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Popular Searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {data.data.map((search) => (
          <Link
            href={`/search?q=${encodeURIComponent(search.query)}`}
            key={search.id}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            {search.query}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularSearches;
