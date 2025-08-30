"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow">{children}</main>
      {path === "/" ? <Footer /> : <CollectionFooter />}
    </div>
  );
}

const CollectionFooter = () => {
  const legalLinks = [
    { href: "/guides", label: "Guides" },
    { href: "/terms-of-sale", label: "Terms of Sale" },
    { href: "/terms-of-use", label: "Terms of Use" },
    { href: "/privacy", label: "Privacy Policy" },
  ];
  return (
    <footer className="bg-black text-white z-3">
      {/* Bottom Bar */}
      <div className="px-4 py-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Nike, Inc. All Rights Reserved</p>
        <ul className="flex space-x-6 mt-4 md:mt-0">
          {legalLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="hover:text-white font-bevellier"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};
