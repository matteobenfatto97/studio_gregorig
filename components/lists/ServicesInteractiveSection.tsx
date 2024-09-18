"use client";

import React, { useState } from "react";
import Image from "next/image";

const servicesData = [
  {
    imageUrl: "/assets/icons/dental/implantologia1.png",
    activeImageUrl: "/assets/icons/dental/implantologia2.png",
    title: "implantologia",
    description:
      "L’implantologia si occupa della sostituzione di uno o più elementi dentali (compromessi o già mancanti) con elementi artificiali formati da una piccola vite in titanio, posizionata attraverso un intervento chirurgico, chiamata impianto dentale.",
  },
  {
    imageUrl: "/assets/icons/dental/chirurgia1.png",
    activeImageUrl: "/assets/icons/dental/chirurgia2.png",
    title: "Chirurgia Orale",
    description:
      "La chirurgia orale si occupa: dell’estrazione di denti compromessi e dell’estrazione di residui radicolari; della rimozione di radici o di denti rimasti inclusi nell’osso; dell’eliminazione dei frenuli e dell’asportazione di cisti e tumori e neoformazioni del cavo orale.",
  },
  {
    imageUrl: "/assets/icons/dental/odontoiatria1.png",
    activeImageUrl: "/assets/icons/dental/odontoiatria2.png",
    title: "Odontoiatria conservativa",
    description:
      "L’odontoiatria conservativa si occupa di trattare le lesioni a carico dello smalto e della dentina dei denti per restaurare la normale funzione ed estetica di quest’ultimi. Per restaurare tali lesioni vengono utilizzate solo resine composite di ultima generazione",
  },
  {
    imageUrl: "/assets/icons/dental/igiene1.png",
    activeImageUrl: "/assets/icons/dental/igiene2.png",
    title: "Igiene dentale",
    description:
      "L’igiene dentale si occupa della prevenzione della carie e delle altre patologie, della terapia di manifestazioni come l’alitosi e della valorizzazione del sorriso mediante terapie e trattamenti quali: l’ablazione del tartaro, la lucidatura e lo sbiancamento dentale.",
  },
  {
    imageUrl: "/assets/icons/dental/medicina1.png",
    activeImageUrl: "/assets/icons/dental/medicina2.png",
    title: "Medicina Orale",
    description:
      "La Patologia e Medicina Orale è quella parte della Odontoiatria che studia le patologie a carico delle mucose orali  e delle ossa mascellari, in modo da effettuare, se necessario, i prelievi bioptici senza dover inviare i pazienti nei centri ospedalieri.",
  },
  {
    imageUrl: "/assets/icons/dental/paradontologia1.png",
    activeImageUrl: "/assets/icons/dental/paradontologia2.png",
    title: "Paradontologia",
    description:
      "La parodontologia è quella branca che si occupa della diagnosi e del trattamento delle patologie che affliggono il parodonto (organo di sostegno dei denti naturali, costituito da: osso alveolare, cemento radicolare, legamento parodontale, gengiva).",
  },
];

const ServicesInteractiveSection: React.FC = () => {
  const [activeService, setActiveService] = useState<{
    imageUrl: string;
    activeImageUrl: string;
    title: string;
    description: string;
  }>(servicesData[0]); // Default to the first service

  return (
    <section className="py-12">
      <div className="container mx-auto text-center">
        {/* Image Titles List */}
        <div className="flex justify-center gap-4 mt-8">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className={`cursor-pointer transition-transform duration-300 transform hover:scale-110 ${
                activeService.title === service.title
              }`}
              onClick={() => setActiveService(service)}
            >
              <Image
                src={
                  activeService.title === service.title
                    ? service.activeImageUrl
                    : service.imageUrl
                }
                height={200} // Adjust size as needed
                width={200} // Adjust size as needed
                alt={service.title}
                className="object-cover h-fill w-full"
              />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mt-8 max-w-xl mx-auto">
          <p className="text-lg text-white">{activeService.description}</p>
        </div>
      </div>
    </section>
  );
};

export default ServicesInteractiveSection;
