"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Menu, User2, X } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { createRedirectUrl } from "@/utils/auth-redirect";
import SearchBar from "./SearchBar";
import { useCartSize } from "@/hooks/cache/use-cart";

const navLinks = [
  { href: "/collections/men", label: "Men" },
  { href: "/collections/women", label: "Women" },
  { href: "/collections/kids", label: "Kids" },
  { href: "/collections", label: "Collections" },
  { href: "/contact-us", label: "Contact" },
];

const Navbar = () => {
  const router = useRouter();
  const path = usePathname();
  const { data: cartData, isLoading: cartLoading } = useCartSize();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data, isPending } = useSession();
  const user = data?.user;

  console.log("@@session: ", data);
  console.log("@@isPending: ", isPending);
  console.log("@@user: ", user);

  // Force session refresh on mount (useful after OAuth redirects)
  useEffect(() => {
    const refreshSession = async () => {
      try {
        await authClient.getSession();
      } catch (error) {
        console.error("Failed to refresh session:", error);
      }
    };

    // Only refresh if we don't have a user but we're not loading
    if (!user && !isPending) {
      refreshSession();
    }
  }, [user, isPending]);

  const routeTo = createRedirectUrl(path, "sign-in");
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      <nav className="container mx-auto xl:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-black.svg"
              alt="Nike Logo"
              width={60}
              height={60}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center flex-1">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-lg text-gray-600 hover:text-black font-bevellier text-heading-3"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side icons */}
        <SearchBar />
        {user ? (
          <div className="hidden md:flex md:ml-4 items-center space-x-3">
            <Link
              href="/cart"
              className="text-base text-gray-600 hover:text-black font-bevellier text-lead text-nowrap flex items-center justify-center"
            >
              My Cart (
              {cartLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                cartData || 0
              )}
              )
            </Link>
            <Link
              href="/profile"
              className="text-base text-gray-600 hover:text-black font-bevellier text-lead"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center p-2 hover:bg-gray-300 transition-colors duration-300 hover:cursor-pointer">
                <User2 size={24} />
              </div>
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center">
            <Button
              type="button"
              onClick={() => router.push(routeTo)}
              variant={"ghost"}
              className="py-0! font-bevellier text-heading-2-medium text-lg hover:cursor-pointer"
            >
              Sign In
            </Button>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-black focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-lg text-gray-600 hover:text-black font-bevellier text-heading-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {user ? (
              <>
                <li>
                  <Link
                    href="/cart"
                    className="text-base text-gray-600 hover:text-black font-bevellier text-lead"
                  >
                    My Cart (
                    {cartLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      cartData || 0
                    )}
                    )
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-base text-gray-600 hover:text-black font-bevellier text-lead"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center p-2 hover:bg-gray-300 transition-colors duration-300 hover:cursor-pointer">
                      <User2 size={24} />
                    </div>
                  </Link>
                </li>
              </>
            ) : (
              <li className="flex items-center">
                <Button
                  type="button"
                  onClick={() => router.push(routeTo)}
                  variant={"ghost"}
                  className="py-0! font-bevellier text-heading-2-medium text-lg hover:cursor-pointer"
                >
                  Sign Inmomom
                </Button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
