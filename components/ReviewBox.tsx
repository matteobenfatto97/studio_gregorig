import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Icons for star rating

interface ReviewBoxProps {
  authorName: string;
  profilePhotoUrl: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
}

const ReviewBox: React.FC<ReviewBoxProps> = ({
  authorName,
  profilePhotoUrl,
  rating,
  text,
  relativeTimeDescription,
}) => {
  // Function to generate stars based on the rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars)
          .fill(null)
          .map((_, index) => (
            <FaStar key={`full-${index}`} className="text-yellow-500" />
          ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {Array(emptyStars)
          .fill(null)
          .map((_, index) => (
            <FaRegStar key={`empty-${index}`} className="text-yellow-500" />
          ))}
      </>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <div className="flex items-center">
        <img
          src={profilePhotoUrl}
          alt={authorName}
          className="w-12 h-12"
        />
        <div className="ml-4 text-black">
          <h3 className="text-lg font-semibold">{authorName}</h3>
          <div className="flex items-center">{renderStars(rating)}</div>
          <p className="text-sm text-gray-500">{relativeTimeDescription}</p>
        </div>
      </div>
      <p className="text-gray-700 mt-4">{text}</p>
    </div>
  );
};

export default ReviewBox;
