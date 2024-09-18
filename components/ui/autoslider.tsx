"use client";

import React, { useState, useEffect } from "react";

const AutoSliderSections = () => {
  const sections = [
    {
      title: "Section 1",
      content: "This is the content for the first section.",
      background: "bg-blue-500",
    },
    {
      title: "Section 2",
      content: "This is the content for the second section.",
      background: "bg-green-500",
    },
    {
      title: "Section 3",
      content: "This is the content for the third section.",
      background: "bg-red-500",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const delay = 5000; // Change section every 5 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sections.length);
    }, delay);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [sections.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"} ${section.background}`}
        >
          <div className="flex flex-col items-center justify-center h-full text-center text-white p-8">
            <h2 className="text-4xl font-bold">{section.title}</h2>
            <p className="text-xl mt-4">{section.content}</p>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sections.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-400"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AutoSliderSections;
