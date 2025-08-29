import clsx from "clsx";
import Image from "next/image";
import { StatusIcon } from "@/constants";
import React from "react";

interface StatusBadgeProps {
  status: Status; // Keep the status type
  label: string; // New label prop
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === "scheduled",
        "bg-blue-600": status === "pending",
        "bg-red-600": status === "cancelled",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt="status icon" // Updated alt text for better accessibility
        width={24}
        height={24}
        className="h-fit w-3 mx-auto"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": status === "scheduled",
          "text-blue-500": status === "pending",
          "text-red-500": status === "cancelled",
        })}
      >
        {label} {/* Use the label prop instead of status */}
      </p>
    </div>
  );
};
