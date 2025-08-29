// components/TeamMemberCard.tsx
import React from "react";
import Image from "next/image";

export interface TeamMemberCardProps {
  imageUrl: string;
  name: string;
  role: string;
  description?: string;
  /** abilita flip/hover SOLO per la card centrale */
  interactive?: boolean;
  /** B/N per le laterali */
  muted?: boolean;
}

const TeamMembersCard: React.FC<TeamMemberCardProps> = ({
  imageUrl,
  name,
  role,
  description = "",
  interactive = false, // default sicuro
  muted = false,
}) => {
  return (
    <div
      className={`mx-auto ${interactive ? "group" : ""} [perspective:1200px]`}
    >
      <div
        className={[
          "relative w-full aspect-[4/5]",
          "duration-500 will-change-transform",
          "[transform-style:preserve-3d]",
          interactive ? "group-hover:[transform:rotateY(180deg)]" : "",
        ].join(" ")}
      >
        {/* FRONT (nessun blur sopra l'immagine) */}
        <div
          className={[
            "absolute inset-0 w-full h-full rounded-xl overflow-hidden",
            "border border-white/10 bg-transparent",
            "[backface-visibility:hidden]",
          ].join(" ")}
        >
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 80vw, 360px"
            quality={90}
            draggable={false}
            className={[
              "object-cover select-none pointer-events-none",
              muted ? "grayscale contrast-95 brightness-95" : "grayscale-0",
            ].join(" ")}
            priority={false}
          />
        </div>

        {/* BACK (mostrata solo se interactive=true e l’utente passa sopra) */}
        <div
          className={[
            "absolute inset-0 w-full h-full rounded-xl overflow-hidden",
            "border border-white/10 bg-slate-950/60", // pannello scuro, niente backdrop-blur
            "[transform:rotateY(180deg)] [backface-visibility:hidden]",
          ].join(" ")}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <h3 className="text-xl font-bold text-white mt-2 mb-1">{name}</h3>
            <p className="text-sm font-medium text-slate-200 mb-3">{role}</p>
            {description && (
              <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembersCard;
