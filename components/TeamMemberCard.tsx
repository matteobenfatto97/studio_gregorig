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

  /** hint di caricamento immagine passate dal carosello */
  imgPriority?: boolean;
  imgLoading?: "eager" | "lazy";
  imgDecoding?: "sync" | "async" | "auto";
  sizes?: string;
}

const TeamMembersCard: React.FC<TeamMemberCardProps> = ({
  imageUrl,
  name,
  role,
  description = "",
  interactive = false,
  muted = false,
  imgPriority = false,
  imgLoading = "lazy",
  imgDecoding = "async",
  sizes = "(max-width: 640px) 68vw, (max-width: 1024px) 360px, 420px",
}) => {
  return (
    <div
      className={`mx-auto ${interactive ? "group" : ""} [perspective:1200px]`}
    >
      <div
        className={[
          // 👉 mobile: quadrata (più bassa); da md: ritratto
          "relative w-full aspect-square md:aspect-[4/5]",
          "duration-500 will-change-transform",
          "[transform-style:preserve-3d]",
          interactive ? "group-hover:[transform:rotateY(180deg)]" : "",
        ].join(" ")}
      >
        {/* FRONT */}
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
            sizes={sizes}
            quality={90}
            draggable={false}
            className={[
              "object-cover select-none pointer-events-none",
              muted ? "grayscale contrast-95 brightness-95" : "grayscale-0",
            ].join(" ")}
            priority={imgPriority}
            loading={imgLoading}
            decoding={imgDecoding}
          />
        </div>

        {/* BACK (mostrata solo se interactive=true e hover) */}
        <div
          className={[
            "absolute inset-0 w-full h-full rounded-xl overflow-hidden",
            "border border-white/10 bg-slate-950/60",
            "[transform:rotateY(180deg)] [backface-visibility:hidden]",
          ].join(" ")}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <h3 className="mt-2 mb-1 text-xl font-bold text-white">{name}</h3>
            <p className="mb-3 text-sm font-medium text-slate-200">{role}</p>
            {description && (
              <p className="text-sm leading-relaxed text-slate-300 line-clamp-4">
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
