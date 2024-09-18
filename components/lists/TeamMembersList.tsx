// components/TeamMembersList.tsx

import React from "react";
import { teamMembers } from "@/lib/teamMembers";
import TeamMembersCard from "../TeamMemberCard";

const TeamMembersList: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 row-gap-2 gap-12 mt-4 mb-4">
      {teamMembers.map((member, index) => (
        <TeamMembersCard
          key={index}
          imageUrl={member.imageUrl}
          name={member.name}
          role={member.role}
          description={member.description}
        />
      ))}
    </div>
  );
};

export default TeamMembersList;
