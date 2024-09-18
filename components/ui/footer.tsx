"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

// Import social media icons
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

// Define the type for the footer link
interface FooterLink {
  href: string;
  label: string;
}

const Footer: React.FC = () => {
  const footerLinks: FooterLink[] = [
    { href: "/", label: "Home" },
    { href: "/chi-siamo", label: "Chi Siamo" },
    { href: "/servizi", label: "Servizi" },
    { href: "/contatti", label: "Contatti" },
    { href: "/informativa-privacy", label: "Informativa Privacy" },
  ];

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center md:mb-0">
            <Image
              src="/assets/icons/aa.png" // Replace with your logo path
              alt="Brand Logo"
              width={300}
              height={50}
            />
            {/* Contact Info */}
            <div className="text-sm mt-1 md:mt-0 items-center mr-8">
              <p>Borgata Palú 88, 32047 Sappada</p>
              <p>Email: gregoriggl@gmail.com </p>
              <p>Telefono: +39 043566198</p>
            </div>
            {/* Social Media Icons */}
            <div className="flex ml-4 mr-4 space-x-4 items-center">
              <Link href="https://facebook.com">
                <FaFacebook className="hover:text-blue-500" />
              </Link>
              <Link href="https://twitter.com">
                <FaTwitter className="hover:text-blue-400" />
              </Link>
              <Link href="https://instagram.com">
                <FaInstagram className="hover:text-pink-500" />
              </Link>
              <Link href="https://linkedin.com">
                <FaLinkedin className="hover:text-blue-700" />
              </Link>
              <div />
              {/* Navigation Links */}
              <div className="flex space-x-4">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-1"></div>
          </div>
        </div>
        {/* Legal Links */}
        <div className="text-center mt-1">
          <p className="text-xs text-gray-400">
            Matteo Benfatto 2024 ® Studio dentistico Dr. Gregorig. Diritti
            Riservati.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
