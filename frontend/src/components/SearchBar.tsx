"use client";

import { useEffect, useRef, useState } from "react";
import { useAutocomplete } from "@/hooks/api/use-search";
import { Input } from "./ui/input";
import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import PopularSearches from "./PopularSearches";
import SearchHistory from "./SearchHistory";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: suggestions,
    isLoading: isLoadingSuggestions,
    isError,
  } = useAutocomplete(debouncedQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      inputRef.current?.blur();
    }
  };

  const onSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    inputRef.current?.blur();
  };

  const showSuggestions = isFocused && (query.length > 0 || !suggestions);
  const showHistory = isFocused && query.length === 0;

  return (
    <div className="relative max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for shoes..."
          className="pl-10 pr-4 py-2 max-w-md rounded-full border-gray-300 focus:border-black focus:ring-black"
        />
        {isLoadingSuggestions && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
      </form>

      {isFocused && (
        <div
          // Use onMouseDown to prevent the blur event from firing before the click
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4"
        >
          {showHistory && (
            <>
              <SearchHistory />
              <div className="my-4 border-t border-gray-100" />
              <PopularSearches />
            </>
          )}

          {showSuggestions && !isError && (
            <ul className="space-y-1">
              {suggestions?.data?.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
