"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import { createRedirectUrl } from "@/utils/auth-redirect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import MyOrdersTab from "@/components/MyOrdersTab";
import FavoritesTab from "@/components/FavoritesTab";
import MyDetailsTab from "@/components/MyDetailsTab";
import PaymentMethodsTab from "@/components/PaymentMethodsTab";
import AddressBookTab from "@/components/AddressBookTab";
import _ from "lodash";
import { useGetUserInfo } from "@/hooks/api/use-userInfo";
import { splitFullName } from "@/utils/helper";

import Error from "@/components/Error";

// Tab configuration
const TAB_CONFIG = [
  {
    value: "my-orders",
    label: "My Orders",
    component: MyOrdersTab,
    priority: 1, // Higher priority shows first on mobile
  },
  {
    value: "favorites",
    label: "Favorites",
    component: FavoritesTab,
    priority: 2,
  },
  {
    value: "my-details",
    label: "My Details",
    component: MyDetailsTab,
    priority: 3,
  },
  {
    value: "payment-methods",
    label: "Payment Methods",
    component: PaymentMethodsTab,
    priority: 4,
  },
  {
    value: "address-book",
    label: "Address Book",
    component: AddressBookTab,
    priority: 5,
  },
];

// Number of tabs to show on mobile before dropdown
const MOBILE_VISIBLE_TABS = 2;

const ResponsiveTabsList = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (value: string) => void;
}) => {
  // Sort tabs by priority for mobile display
  const sortedTabs = [...TAB_CONFIG].sort((a, b) => a.priority - b.priority);
  const visibleTabs = sortedTabs.slice(0, MOBILE_VISIBLE_TABS);
  const dropdownTabs = sortedTabs.slice(MOBILE_VISIBLE_TABS);

  // Check if active tab is in dropdown (for mobile)
  const activeTabInDropdown = dropdownTabs.find(
    (tab) => tab.value === activeTab
  );
  // const activeTabLabel =
  //   TAB_CONFIG.find((tab) => tab.value === activeTab)?.label || "";

  // Common tab trigger classes
  const tabTriggerClasses =
    "md:py-[1.8rem] font-bevellier flex justify-start text-lg font-semibold text-gray-500 rounded-none border-b-2 border-transparent data-[state=active]:border-b-black data-[state=active]:text-black data-[state=active]:shadow-none";

  return (
    <>
      {/* Desktop TabsList - Show all tabs */}
      <TabsList className="hidden md:flex w-3/5 gap-2 items-center justify-between rounded-none bg-transparent p-0">
        {TAB_CONFIG.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={tabTriggerClasses}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Mobile TabsList - Show limited tabs + dropdown */}
      <div className="flex md:hidden w-full items-center rounded-none bg-transparent p-0">
        {/* Visible tabs on mobile */}
        {visibleTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              py-[1.38rem] px-4 font-bevellier flex justify-start text-lg font-semibold rounded-none border-b-2 transition-colors
              ${
                activeTab === tab.value
                  ? "border-b-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }
            `}
          >
            {tab.label}
          </button>
        ))}

        {/* Dropdown for remaining tabs */}
        {dropdownTabs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`
                  py-[1.38rem] px-4 font-bevellier text-lg font-semibold rounded-none border-b-2 transition-colors h-auto
                  ${
                    activeTabInDropdown
                      ? "border-b-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {activeTabInDropdown
                    ? activeTabInDropdown.label.slice(0, 8).concat("...")
                    : "More"}
                  <ChevronDown className="w-4 h-4" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              {dropdownTabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => onTabChange(tab.value)}
                  className={`
                    font-bevellier text-base cursor-pointer
                    ${
                      activeTab === tab.value ? "bg-gray-100 font-semibold" : ""
                    }
                  `}
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
};

const ProfilePage = () => {
  const router = useRouter();
  const path = usePathname();
  const { data: userInfo, isLoading, isError, error } = useGetUserInfo();
  const [activeTab, setActiveTab] = useState("my-orders");

  useEffect(() => {
    if (!isLoading && !userInfo?.data) {
      const redirect = createRedirectUrl(path, "sign-in");
      router.push(redirect);
    }
  }, [isLoading, userInfo?.data, path, router]);

  if (isError) {
    return <Error title="Error" error={error} />;
  }
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading profile...</span>
      </div>
    );
  }

  const [firstName, lastName] =
    userInfo?.data && splitFullName(userInfo.data.name);
  const customer = {
    firstName: firstName,
    lastName: lastName,
    email: userInfo.data.email || "",
    avatarUrl: userInfo.data.image || "https://github.com/shadcn.png",
    fallback: "RW",
    dob: userInfo.data.dob || "",
    addresses: userInfo.data.addresses || [],
  };
  const customerDetails = _.omit(customer, "avatarUrl", "fallback");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-12">
      <main className="flex flex-col items-center gap-12">
        {/* User Profile Info */}
        <aside className="flex w-full">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 sm:h-28 sm:w-28">
              <AvatarImage src={customer.avatarUrl} alt={customer.firstName} />
              <AvatarFallback className="text-lg sm:text-xl">
                {customer.fallback}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{`${customer.firstName} ${customer.lastName}`}</h1>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
        </aside>

        {/* Tabs Section */}
        <div className="flex w-full">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full relative"
          >
            {/* Horizontal line under tabs */}
            <div className="w-full h-[1px] bg-gray-300 absolute top-[4.5rem] md:top-[3rem] left-0" />

            {/* Responsive TabsList */}
            <ResponsiveTabsList
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            {/* Tab Content */}
            <div className="mt-8">
              {TAB_CONFIG.map((tab) => {
                const Component = tab.component;
                return (
                  <TabsContent key={tab.value} value={tab.value}>
                    <Component
                      customerDetails={customerDetails}
                      userAddresses={customer.addresses}
                    />
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
