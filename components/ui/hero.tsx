"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  const sections = [
    {
      image: "/assets/images/smile.jpeg",
      icon1: "/assets/icons/frase.png",
      icon2: "/assets/icons/frase2.png",
      buttonText: "Prenota!",
      buttonLink: "/servizi",
      icon1Position: { top: "30%", left: "0%" },
      icon2Position: { top: "40%", left: "15%" },
      buttonPosition: { top: "60%", left: "20%" },
      description: "Get the perfect smile today.",
      className: "hero-zoom",
    },
    {
      image: "/assets/images/happykid.jpeg",
      icon1: "/assets/icons/frase.png",
      icon2: "/assets/icons/frase2.png",
      implantologia: "/assets/icons/dental/implantologia.png",
      chirurgia: "/assets/icons/dental/chirurgia.png",
      odontoiatria: "/assets/icons/dental/odontoiatria.png",
      igiene: "/assets/icons/dental/igiene.png",
      medicina: "/assets/icons/dental/medicina.png",
      paradontologia: "/assets/icons/dental/paradontologia.png",
      buttonText: "",
      buttonLink: "",
      icon1Position: { top: "30%", left: "0%" },
      icon2Position: { top: "40%", left: "15%" },
    },
    {
      image: "/assets/images/intervento.jpg",
      icon1: "",
      icon2: "",
      icon1Position: { top: "30%", left: "0%" },
      icon2Position: { top: "40%", left: "15%" },
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const delay = 10000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sections.length);
    }, delay);

    return () => clearInterval(interval);
  }, [sections.length]);

  const {
    image,
    icon1,
    icon2,
    implantologia,
    chirurgia,
    odontoiatria,
    igiene,
    medicina,
    paradontologia,
    buttonText,
    buttonLink,
    buttonPosition,
    icon1Position,
    icon2Position,
    className,
  } = sections[currentIndex];

  const isSecondSection = currentIndex === 1;

  return (
    <section
      className={`relative w-full h-screen bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0"></div>

      <div className="relative z-10 flex flex-col items-start ml-8 justify-center h-full text-white">
        {/* Conditionally render title and subtitle */}
        {icon1 && (
          <Image
            src={icon1}
            alt="icon1"
            width={700}
            height={100}
            style={icon1Position}
            className="absolute fade-in-up icon-1"
          />
        )}
        {icon2 && (
          <Image
            src={icon2}
            alt="icon2"
            width={300}
            height={55}
            style={icon2Position}
            className="absolute fade-in-up icon-2"
          />
        )}

        {/* Conditionally render vertical dental icons with animation, delayed in reverse order */}
        {implantologia && (
          <Image
            src={implantologia}
            alt="implantologia"
            width={500}
            height={70}
            style={{ position: "absolute", left: "60%", top: "5%" }}
            className={isSecondSection ? "icon-animation icon-1" : ""}
          />
        )}
        {chirurgia && (
          <Image
            src={chirurgia}
            alt="chirurgia"
            width={500}
            height={70}
            style={{ position: "absolute", left: "60%", top: "20%" }}
            className={isSecondSection ? "icon-animation icon-2" : ""}
          />
        )}
        {odontoiatria && (
          <Image
            src={odontoiatria}
            alt="odontoiatria"
            width={500}
            height={70}
            style={{ position: "absolute", left: "60%", top: "35%" }}
            className={isSecondSection ? "icon-animation icon-3" : ""}
          />
        )}
        {igiene && (
          <Image
            src={igiene}
            alt="igiene"
            width={500}
            height={70}
            style={{ position: "absolute", left: "60%", top: "50%" }}
            className={isSecondSection ? "icon-animation icon-4" : ""}
          />
        )}
        {medicina && (
          <Image
            src={medicina}
            alt="medicina"
            width={500}
            height={70}
            style={{ position: "absolute", left: "60%", top: "65%" }}
            className={isSecondSection ? "icon-animation icon-5" : ""}
          />
        )}
        {paradontologia && (
          <Image
            src={paradontologia}
            alt="paradontologia"
            width={500}
            height={70}
            style={{ position: "absolute", left: "60%", top: "80%" }}
            className={isSecondSection ? "icon-animation icon-6" : ""}
          />
        )}

        {/* Conditionally render button if buttonText and buttonLink are provided */}
        {buttonText && buttonLink && (
          <Link
            href={buttonLink}
            className="py-6 px-8 bg-blueGreenGradient text-white rounded-md text-2xl hover:bg-teal-700 transition duration-300 absolute scroll-open"
            style={buttonPosition}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default Hero;
