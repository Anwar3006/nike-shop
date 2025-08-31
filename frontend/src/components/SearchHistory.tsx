"use client";
import { useSearchHistory } from "@/hooks/api/use-search";
import { authClient } from "@/lib/auth-client";
import { History, Loader2 } from "lucide-react";
import Link from "next/link";

const SearchHistory = () => {
  const { data: session, isPending } = authClient.useSession();
  const { data, isLoading, isError } = useSearchHistory(
    session?.user?.id || ""
  );

  if (isLoading || isPending) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading search history...</span>
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    // Don't show anything if there's an error or no history
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
        <History className="w-4 h-4" />
        Recent Searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {data.data.map((search, index) => (
          <Link
            href={`/search?q=${encodeURIComponent(search.query)}`}
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            {search.query}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
