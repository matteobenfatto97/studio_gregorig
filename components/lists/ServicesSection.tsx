"use client";

import React from "react";
import Service from "../ui/Service";
import { motion } from "framer-motion";

const services = [
  {
    imageUrl: "/assets/icons/dental/implantologiaIcon.png",
    imageTitleUrl: "/assets/icons/dental/implantologia1.png", // Image for title
    description:
      "L’implantologia si occupa della sostituzione di uno o più elementi dentali (compromessi o già mancanti) con elementi artificiali formati da una piccola vite in titanio, posizionata attraverso un intervento chirurgico, chiamata impianto dentale.",
  },
  {
    imageUrl: "/assets/icons/dental/chirurgiaIcon.png",
    imageTitleUrl: "/assets/icons/dental/chirurgia1.png", // Image for title
    description:
      "La chirurgia orale si occupa: dell’estrazione di denti compromessi e dell’estrazione di residui radicolari; della rimozione di radici o di denti rimasti inclusi nell’osso; dell’eliminazione dei frenuli e dell’asportazione di cisti e tumori e neoformazioni del cavo orale.",
  },
  {
    imageUrl: "/assets/icons/dental/odontoiatriaIcon.png",
    imageTitleUrl: "/assets/icons/dental/odontoiatria1.png", // Image for title
    description:
      "L’odontoiatria conservativa si occupa di trattare le lesioni a carico dello smalto e della dentina dei denti per restaurare la normale funzione ed estetica di quest’ultimi. Per restaurare tali lesioni vengono utilizzate solo resine composite di ultima generazione.",
  },
  {
    imageUrl: "/assets/icons/dental/igieneIcon.png",
    imageTitleUrl: "/assets/icons/dental/igiene1.png", // Image for title
    description:
      "L’igiene dentale si occupa della prevenzione della carie e delle altre patologie, della terapia di manifestazioni come l’alitosi e della valorizzazione del sorriso mediante terapie e trattamenti quali: l’ablazione del tartaro, la lucidatura e lo sbiancamento dentale.",
  },
  {
    imageUrl: "/assets/icons/dental/medicinaIcon.png",
    imageTitleUrl: "/assets/icons/dental/medicina1.png", // Image for title
    description:
      "La Patologia e Medicina Orale è quella parte della Odontoiatria che studia le patologie a carico delle mucose orali  e delle ossa mascellari, in modo da effettuare, se necessario, i prelievi bioptici senza dover inviare i pazienti nei centri ospedalieri.",
  },
  {
    imageUrl: "/assets/icons/dental/paradontologiaIcon.png",
    imageTitleUrl: "/assets/icons/dental/paradontologia1.png", // Image for title
    description:
      "La parodontologia è quella branca che si occupa della diagnosi e del trattamento delle patologie che affliggono il parodonto (organo di sostegno dei denti naturali, costituito da: osso alveolare, cemento radicolare, legamento parodontale, gengiva).",
  },
];
// Define animation variants for individual card reveal with delay
const cardVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

const ServicesSection: React.FC = () => {
  return (
    <div className="mt-10 mb-20">
      {/* Title and Subtitle */}
      <h2 className="text-center text-3xl font-bold mb-4">I nostri Servizi</h2>
      <p className="text-center text-lg mb-10">
        Offriamo una vasta gamma di servizi per soddisfare tutte le vostre
        necessità dentali.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12">
        {services.map((service, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={cardVariants}
          >
            <Service
              imageUrl={service.imageUrl}
              imageTitleUrl={service.imageTitleUrl}
              description={service.description}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
