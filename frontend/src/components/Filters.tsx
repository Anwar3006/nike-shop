"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { formUrlQuery } from "@/utils/query";
import { ChevronDown, Filter } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Slider } from "@/components/ui/slider";

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

  // Size range state for the slider (default range: 5.0 to 13.0)
  const [sizeRange, setSizeRange] = useState<number[]>([5.0, 13.0]);

  // Debounced size filter update
  const handleSizeRangeChange = (value: number[]) => {
    setSizeRange(value);

    // Create size range string for URL (e.g., "5.0-13.0")
    const sizeRangeValue = `${value[0]}-${value[1]}`;

    const newQuery = formUrlQuery({
      params: searchParams.toString(),
      key: "size",
      value: sizeRangeValue,
      pathname,
    });

    router.push(newQuery, { scroll: false });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newQuery = formUrlQuery({
      params: searchParams.toString(),
      key,
      value,
      pathname,
    });

    router.push(newQuery, { scroll: false });
  };

  const renderSizeSlider = () => (
    <div className="pl-4 py-4 space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground font-bevellier">
          <span>Size {sizeRange[0]}</span>
          <span>Size {sizeRange[1]}</span>
        </div>
        <Slider
          value={sizeRange}
          onValueChange={handleSizeRangeChange}
          min={5.0}
          max={16.0}
          step={0.5}
          className="w-full"
          minStepsBetweenThumbs={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground font-bevellier">
          <span>5.0</span>
          <span>8.5</span>
          <span>12.0</span>
          <span>16.0</span>
        </div>
      </div>
    </div>
  );

  const renderDropdownFilters = () => (
    <SidebarMenu>
      {filterGroups.map((group) => (
        <SidebarMenuItem key={group.key}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-full justify-between">
                <span className="font-bevellier text-lead">{group.name}</span>
                <ChevronDown className="w-4 h-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {group.options.map((option: FilterOption) => {
                const label =
                  typeof option === "string"
                    ? option
                    : "label" in option
                    ? option.label
                    : option.name;
                const value =
                  typeof option === "string"
                    ? option
                    : "value" in option
                    ? option.value
                    : option.hex;

                return (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => handleFilterChange(group.key, value)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      {group.key === "color" &&
                        typeof option === "object" &&
                        "hex" in option && (
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: option.hex }}
                          />
                        )}
                      <span className="font-bevellier text-[1.05rem]">
                        {label}
                      </span>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      ))}

      {/* Size Slider in Dropdown */}
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full justify-between">
              <span className="font-bevellier text-lead">Size</span>
              <ChevronDown className="w-4 h-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-4" align="start">
            {renderSizeSlider()}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );

  const renderCollapsibleFilters = () => (
    <SidebarMenu>
      {filterGroups.map((group) => (
        <Collapsible key={group.key} defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full justify-between">
                <span className="font-bevellier text-lead">{group.name}</span>
                <ChevronDown className="w-4 h-4 group-data-[state=open]/collapsible:rotate-180 transition-transform" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pl-4 py-2 space-y-2">
                <RadioGroup
                  value={searchParams.get(group.key) || ""}
                  onValueChange={(value) =>
                    handleFilterChange(group.key, value)
                  }
                  className="grid grid-cols-2"
                >
                  {group.options.map((option: FilterOption) => {
                    const label =
                      typeof option === "string"
                        ? option
                        : "label" in option
                        ? option.label
                        : option.name;
                    const value =
                      typeof option === "string"
                        ? option
                        : "value" in option
                        ? option.value
                        : option.hex;

                    return (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={value}
                          id={value}
                          onClick={() => handleFilterChange(group.key, value)}
                        />
                        <Label
                          htmlFor={value}
                          className="font-bevellier text-[1.05rem] cursor-pointer flex items-center space-x-2"
                        >
                          {group.key === "color" &&
                            typeof option === "object" &&
                            "hex" in option && (
                              <div
                                className="w-4 h-4 rounded-sm border border-gray-300"
                                style={{ backgroundColor: option.hex }}
                              />
                            )}
                          <span>{label}</span>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ))}

      {/* Size Slider - Separate collapsible section */}
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between">
              <span className="font-bevellier text-lead">Size</span>
              <ChevronDown className="w-4 h-4 group-data-[state=open]/collapsible:rotate-180 transition-transform" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>{renderSizeSlider()}</CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar className="border-none" collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xl font-semibold my-4 font-bevellier">
                Filters
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {renderDropdownFilters()}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block z-2">
        <Sidebar
          className="border-none fixed top-16 left-0 h-[calc(100vh-8rem)] w-80 z-10 bg-white overflow-y-auto"
          collapsible="none"
        >
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xl font-semibold my-4 font-bevellier">
                Filters
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {renderCollapsibleFilters()}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </>
  );
};

export default Filters;
