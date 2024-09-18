// src/components/Header.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();

  const navigateToChiSiamo = () => {
    router.push("/chi-siamo");
  };
  const navigateToContatti = () => {
    router.push("/contatti");
  };
  const navigateToServizi = () => {
    router.push("/servizi");
  };

  return (
    <header className="w-full p-4 bg-gray-800 text-white flex justify-between items-center">
      <Image
        src="/assets/icons/aa.png"
        height={150}
        width={200}
        alt="logo"
        className="w-fit h-fit"
      />
      <nav className="items-center mr-5">
        <ul className="flex space-x-4 items-center">
          <li>
            <Link href="/" passHref>
              <button className="btn">
                <Image
                  src="/assets/icons/home.png"
                  height={70}
                  width={130}
                  alt="home"
                />
              </button>
            </Link>
          </li>
          <li>
            <Link href="/chi-siamo" passHref onClick={navigateToChiSiamo}>
              <button className="btn">
                <Image
                  src="/assets/icons/chiSiamo.png"
                  height={70}
                  width={190}
                  alt="chiSiamo"
                />
              </button>
            </Link>
          </li>
          <li>
            <Link href="/servizi" passHref onClick={navigateToServizi}>
              <button className="btn">
                <Image
                  src="/assets/icons/servizi.png"
                  height={70}
                  width={150}
                  alt="servizi"
                />
              </button>
            </Link>
          </li>
          <li>
            <Link href="/contatti" passHref onClick={navigateToContatti}>
              <button className="btn">
                <Image
                  src="/assets/icons/contatti.png"
                  height={70}
                  width={150}
                  alt="contatti"
                />
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
