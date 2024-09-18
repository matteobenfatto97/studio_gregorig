// components/TeamMemberCard.tsx

import React from "react";

interface TeamMemberCardProps {
  imageUrl: string;
  name: string;
  role: string;
  description: string;
}

const TeamMembersCard: React.FC<TeamMemberCardProps> = ({
  imageUrl,
  name,
  role,
  description,
}) => {
  return (
    <div className="card-container mx-auto group perspective">
      <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full card-face card-front bg-white rounded-lg overflow-hidden glassmorphism">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full card-face card-back glassmorphism transform rotate-y-180 overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-xl font-bold text-white mt-2 mb-2">{name}</h2>
            <p className="text-lg font-semibold text-gray-200 mt-4 mb-4">
              {role}
            </p>
            <p className="text-gray-300 text-sm mt-4 mb-4">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembersCard;
