"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { formUrlQuery } from "@/utils/query";
import { ChevronDown, Filter } from "lucide-react";

type FilterOption =
  | string
  | { name: string; hex: string }
  | { label: string; value: string };

const filterGroups = [
  {
    name: "Gender",
    key: "gender",
    options: ["men", "women", "kids", "unisex"],
  },
  {
    name: "Size",
    key: "size",
    options: ["5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0", "9.5", "10.0", "10.5", "11.0"],
  },
  {
    name: "Color",
    key: "color",
    options: [
      { name: "Red", hex: "#FF0000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" },
      { name: "Silver", hex: "#C0C0C0" },
    ],
  },
  {
    name: "Price",
    key: "price",
    options: [
      { label: "$0 - $50", value: "0-50" },
      { label: "$50 - $100", value: "50-100" },
      { label: "$100 - $150", value: "100-150" },
      { label: "$150+", value: "150-1000" },
    ],
  },
];

const Filters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["Gender", "Price"]);

  const handleFilterChange = (key: string, value: string) => {
    const currentValues = searchParams.get(key)?.split(",") || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const newQuery = formUrlQuery({
      params: searchParams.toString(),
      key,
      value: newValues.length > 0 ? newValues.join(",") : null,
      pathname,
    });

    router.push(newQuery, { scroll: false });
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const renderFilters = () => (
    <div className="space-y-6">
      {filterGroups.map((group) => (
        <div key={group.name}>
          <button
            onClick={() => toggleSection(group.name)}
            className="w-full flex justify-between items-center py-2 text-left font-semibold"
          >
            {group.name}
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                openSections.includes(group.name) ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.includes(group.name) && (
            <div className="pt-2 space-y-2">
              {group.options.map((option: FilterOption) => {
                const value = typeof option === "string" ? option : "value" in option ? option.value : option.name;
                const label = typeof option === "string" ? option : "label" in option ? option.label : option.name;
                const isChecked = searchParams.get(group.key)?.split(",").includes(value);

                return (
                  <label key={value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleFilterChange(group.key, value)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {group.key === "color" && typeof option === "object" && "hex" in option && (
                       <span
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: option.hex }}
                      />
                    )}
                    <span className="capitalize">{label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsDrawerOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative bg-white w-80 h-full p-6">
            <h3 className="text-xl font-semibold mb-6">Filters</h3>
            {renderFilters()}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <h3 className="text-xl font-semibold mb-6">Filters</h3>
        {renderFilters()}
      </div>
    </>
  );
};

export default Filters;
