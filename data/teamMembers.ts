// data/teamMembers.ts
import type { StaticImageData } from "next/image";

// 🔒 Importa TUTTE le immagini dalla cartella public (case-sensitive in prod)
import drGregorig from "@/public/assets/team/dr.Gregorig.png";
import drCarla from "@/public/assets/team/dr.ssaCarla.png";
import drGiulia from "@/public/assets/team/dr.ssaGiulia.png";
import drAnna from "@/public/assets/team/dr.ssaAnna.png";
import fabrizia from "@/public/assets/team/fabrizia.png";
import jessica from "@/public/assets/team/jessica.png";
import agnese from "@/public/assets/team/agnese.png";
import alessandra from "@/public/assets/team/alessandra.png";

export type TeamMember = {
  imageUrl: StaticImageData;
  name: string;
  role: string;
  description?: string;
};

export const teamMembers: TeamMember[] = [
  {
    imageUrl: drGregorig,
    name: "Dr. Gianluca Gregorig",
    role: "Chirurgo dentale",
    description:
      "Specializzato in chirurgia dentale e implantologia, con oltre 25 anni di esperienza.",
  },
  {
    imageUrl: drCarla,
    name: "Dr.ssa Carla Fonda",
    role: "Ortodonzia",
    description:
      "Esperta in ortodonzia con un approccio moderno e personalizzato.",
  },
  {
    imageUrl: drGiulia,
    name: "Dr.ssa Giulia Piller",
    role: "Igienista dentale",
    description: "",
  },
  {
    imageUrl: drAnna,
    name: "Dr.ssa Anna di Piazza",
    role: "Igienista dentale",
    description: "",
  },
  {
    imageUrl: fabrizia,
    name: "Fabrizia de Candido",
    role: "Assistente alla poltrona",
    description: "",
  },
  {
    imageUrl: jessica,
    name: "Jessica Zanardo",
    role: "Assistente alla poltrona",
    description: "",
  },
  {
    imageUrl: agnese,
    name: "Agnese Menardi",
    role: "Assistente alla poltrona",
    description: "",
  },
  {
    imageUrl: alessandra,
    name: "Alessandra Marta",
    role: "Assistente alla poltrona",
    description: "",
  },
];
