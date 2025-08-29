"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ServiceProps {
  imageUrl: string;
  imageTitleUrl: string; // Add a new prop for the title image
  description: string;
}

const Service: React.FC<ServiceProps> = ({
  imageUrl,
  imageTitleUrl,
  description,
}) => {
  const [tiltStyle, setTiltStyle] = useState({ transform: "" });
  const [shadowStyle, setShadowStyle] = useState({ boxShadow: "" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate tilt based on mouse position relative to corners
    const x = mouseX - centerX;
    const y = mouseY - centerY;

    let rotateX = (y / centerY) * 20; // Adjust tilt intensity
    let rotateY = -(x / centerX) * 20; // Adjust tilt intensity

    // Adjust tilt for different corners
    if (mouseX < 50 && mouseY < 50) {
      rotateX = -10;
      rotateY = 10;
    } else if (mouseX > centerX * 2 && mouseY < 50) {
      rotateX = -10;
      rotateY = -10;
    } else if (mouseX < 50 && mouseY > centerY * 2) {
      rotateX = 10;
      rotateY = 10;
    } else if (mouseX > centerX * 2 && mouseY > centerY * 2) {
      rotateX = 10;
      rotateY = -10;
    }

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });

    // Update shadow style based on tilt
    setShadowStyle({
      boxShadow: `0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.5), ${rotateY}px ${rotateX}px 10px rgba(0, 255, 255, 0.3)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
    });
    setShadowStyle({
      boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)", // Default shadow
    });
  };

  return (
    <div
      className="glassmorphism-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...tiltStyle, ...shadowStyle, width: "380px", height: "410px" }} // Adjust size here
    >
      <div className="content">
        <div className="image-container">
          <Image
            src={imageUrl}
            alt=""
            width={90} // Adjust size of image here
            height={90} // Adjust size of image here
            className="rounded-md img-size" // Apply image size class
          />
        </div>
        <div className="details">
          <img
            src={imageTitleUrl}
            alt="Service Title"
            className="service-title mb-4"
          />{" "}
          {/* Image for title */}
          <span className="description-text">{description}</span>
        </div>
      </div>
    </div>
  );
};

export default Service;
