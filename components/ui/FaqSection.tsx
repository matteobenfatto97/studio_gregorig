"use client";

import React from "react";

// Define the content for each block
const faqContent = [
  {
    title: "Alitosi & Pulizia dei Denti",
    text: `Alitosi: La causa più frequente di alitosi dipende dalla malattia parodontale, sia nel suo esordio come gengivite, ma soprattutto quando si instaura la parodontite che nella fase acuta si chiama Piorrea, e che danneggia il legamento con cui i denti sono uniti all’osso. Esistono anche altre cause di alitosi legate a disfunzioni dell’apparato digerente.

Pulizia dei denti: Le sedute di igiene orale devono essere effettuate ogni 6 mesi per tutti i pazienti, mentre per i pazienti risanati dalla mallattia parodontale, hanno una cadenza individuale.`,
    imageUrl: "/assets/images/faq1.jpg", // Replace with actual image path
  },
  {
    title: "Lo Spazzolino & Le Gengive",
    text: `
Lo Spazzolino: Lo spazzolino deve avere caratteristiche ben specifiche: il manico dritto, una testina poco ingombrante per raggiungere facilmente ogni parte della bocca, setole artificiali non troppo rigide e arrotondate in punta. Le setole devono essere integre, di pari lunghezza e perfettamente dritte. Non appena perde queste caratteristiche di integrità e funzionalità lo spazzolino va cambiato perché con l’uso si consuma e si deforma.

Le Gengive sanguinanti: Sono dovuta alla presenza di una gengivite che è un’infiammazione batterica che si instaura per la presenza di placca che non viene asportata in modo corretto con lo spazzolino.`,
    imageUrl: "/assets/images/faq2.jpg", // Replace with actual image path
  },
  {
    title: "Devitalizzazione & Dolore",
    text: `Devitalizzazione: La devitalizzazione del dente è l’asportazione, mediante un intervento eseguito dal dentista, della polpa dentale, la parte interna dell’organo danneggiato. È detta terapia (o cura) canalare, perché durante l’operazione si lavora sui canali interni del dente, che viene privato delle sue terminazioni nervose. Poi, quando questa fase è terminata, può essere incapsulato, ossia rivestito di ceramica, che lo isola e protegge da nuovi attacchi.

Dolore durante le operazioni: Grazie alle nuove tecniche impiegate tutto viene fatto in modo semplice, veloce e indolore.`,
    imageUrl: "/assets/images/faq3.jpg", // Replace with actual image path
  },
];

const FAQSection: React.FC = () => {
  return (
    <div className="faq-section my-20">
      <h2 className="text-center text-4xl font-extrabold mb-8 text-white">
        Facciamo Chiarezza su alcuni aspetti
      </h2>
      <p className="text-center text-lg mb-12 text-gray-600">
        Alcuni degli interrogativi più frequenti!
      </p>

      {/* Render each block with specific width and alignment */}
      {faqContent.map((content, index) => (
        <div
          key={index}
          className={`flex flex-col md:flex-row items-center mb-16 bg-white shadow-md rounded-xl overflow-hidden ${
            index % 2 === 0 ? "md:flex-row-reverse ml-auto" : "mr-auto"
          } glassmorphism-card`}
          style={{ maxWidth: "75%" }} // Set max width to 75% for all blocks
        >
          {/* Image Section */}
          <div className="md:w-1/2 w-full overflow-hidden relative">
            <img
              src={content.imageUrl}
              alt={content.title}
              className="w-full h-full object-cover transform transition duration-300 ease-in-out hover:scale-105"
            />
          </div>

          {/* Text Section */}
          <div className="md:w-1/2 w-full p-8 md:p-12">
            <h3 className="text-3xl font-semibold mb-6 text-teal-600">
              {content.title}
            </h3>
            <p className="text-base text-white leading-relaxed">
              {content.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQSection;
