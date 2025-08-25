"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { formUrlQuery } from "@/utils/query";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: High-Low", value: "price-desc" },
  { label: "Price: Low-High", value: "price-asc" },
];

const Sort = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortValue = e.target.value;
    const newQuery = formUrlQuery({
      params: searchParams.toString(),
      key: "sort",
      value: newSortValue,
      pathname,
    });
    router.push(newQuery, { scroll: false });
  };

  const currentSort = searchParams.get("sort") || "featured";

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium">
        Sort by:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Sort;
