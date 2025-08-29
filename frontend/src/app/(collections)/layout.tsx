import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Filters from "@/components/Filters";

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />

        <div className="flex flex-1 relative">
          <Filters />
          <main className="flex-1 lg:ml-80 min-h-0">
            <div className="lg:hidden">
              <SidebarTrigger />
            </div>
            {children}
          </main>
        </div>

        <CollectionFooter />
      </div>
    </SidebarProvider>
  );
}

const CollectionFooter = () => {
  const legalLinks = [
    { href: "#", label: "Guides" },
    { href: "#", label: "Terms of Sale" },
    { href: "#", label: "Terms of Use" },
    { href: "#", label: "Privacy Policy" },
  ];
  return (
    <footer className="bg-black text-white z-10 fixed bottom-0 left-0 right-0 mt-12">
      {/* Bottom Bar */}
      <div className="px-4 py-5 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Nike, Inc. All Rights Reserved</p>
        <ul className="flex space-x-6 mt-4 md:mt-0">
          {legalLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};
