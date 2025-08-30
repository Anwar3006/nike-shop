import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const footerLinks = {
  featured: [
    { href: "#", label: "Air Force 1" },
    { href: "#", label: "Air Max 90" },
    { href: "#", label: "Air Max 95" },
  ],
  shoes: [
    { href: "#", label: "All Shoes" },
    { href: "#", label: "Jordan Shoes" },
    { href: "#", label: "Running Shoes" },
    { href: "#", label: "Basketball Shoes" },
  ],
  clothing: [
    { href: "#", label: "All Clothing" },
    { href: "#", label: "Hoodies & Pullovers" },
    { href: "#", label: "Shorts & Tops" },
  ],
  kids: [
    { href: "#", label: "Infant & Toddler Shoes" },
    { href: "#", label: "Kids' Shoes" },
    { href: "#", label: "Kids' Basketball Shoes" },
    { href: "#", label: "Kids' Jordan Shoes" },
  ],
};

const socialLinks = [
  { href: "#", icon: FaXTwitter, alt: "X Logo" },
  { href: "#", icon: FaFacebook, alt: "Facebook Logo" },
  { href: "#", icon: FaInstagram, alt: "Instagram Logo" },
];

const legalLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/terms-of-sale", label: "Terms of Sale" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/privacy", label: "Privacy Policy" },
];

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="col-span-1 mb-8 md:mb-0">
            <Link href="/">
              <Image src="/logo.svg" alt="Nike Logo" width={80} height={80} />
            </Link>
          </div>

          {/* Links */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <h4 className="font-bold mb-4 font-bevellier text-lead">
                Featured
              </h4>
              <ul>
                {footerLinks.featured.map((link) => (
                  <li key={link.label} className="mb-2">
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white font-bevellier text-body-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-bevellier text-lead">Shoes</h4>
              <ul>
                {footerLinks.shoes.map((link) => (
                  <li key={link.label} className="mb-2">
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white font-bevellier text-body-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-bevellier text-lead">
                Clothing
              </h4>
              <ul>
                {footerLinks.clothing.map((link) => (
                  <li key={link.label} className="mb-2">
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white font-bevellier text-body-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-bevellier text-lead">
                Kids&apos;
              </h4>
              <ul>
                {footerLinks.kids.map((link) => (
                  <li key={link.label} className="mb-2">
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white font-bevellier text-body-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="col-span-1 flex md:justify-end space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.alt}
                href={link.href}
                className="bg-white p-2 rounded-full text-black w-10 h-10 hover:bg-white/80 transition-colors duration-500 inline-flex items-center justify-center"
              >
                <link.icon size={24} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Nike, Inc. All Rights Reserved
          </p>
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
      </div>
    </footer>
  );
};

export default Footer;
