"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const CallUsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observing once visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`call-us-section w-full ${isVisible ? "animate-unfold" : ""}`}
    >
      <div className="call-us-background" />
      <div className="call-us-content">
        <Image
          src="/assets/icons/contattaci.png"
          height={150}
          width={200}
          alt="contattaci"
          className="w-fit h-fit mx-auto pulse-effect" // Add pulse-effect class here
        />
        <p className="call-us-description">
          Per assistenza immediata chiama: <strong>(+39) 043566198</strong>
        </p>
        <a href="tel:+1234567890" className="call-us-button">
          Chiama
        </a>
      </div>
    </section>
  );
};

export default CallUsSection;
