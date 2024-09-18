// app/chi-siamo/page.tsx

import LiveChat from "@/components/Chatbot";
import TeamMembersList from "@/components/lists/TeamMembersList";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import React from "react";
import Image from "next/image";

// pages/chi-siamo.tsx

const ChiSiamoPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-black-300 py-12 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-teal-600">Chi Siamo</h1>
          <p className="mt-4 text-lg text-gray-600">
            Scopri di più sulla nostra clinica dentale e il nostro team di
            esperti.
          </p>
        </div>

        {/* Mission Statement Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="glassmorphism-card shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-200">
              La Nostra Missione
            </h2>
            <p className="mt-4 text-white">
              Lo studio Dentistico Gregorig offre trattamenti odontoiatrici di
              ogni specialità, garantendo serietà , professionalità e massima
              accuratezza; il paziente ha la garanzia di essere seguito per
              tutto il percorso terapeutico ed anche successivamente, rientrando
              in un programma di richiami periodici e di prevenzione. Tutto
              questo è possibile mettendo a disposizione dell’ utenza la propria
              esperienza di oltre 20 anni di attività nel campo, garantendo un
              continuo aggiornamento medico ed avvalendosi delle tecniche più
              moderne e funzionali. Il paziente viene messo a proprio agio,
              instaurando un rapporto di fidelizzazione clinica con
              l’odontoiatra, che lo seguirà scrupolosamente garantendo peraltro
              un servizio di reperibilità anche al di fuori dell’orario di
              apertura dello studio. Lo Studio Gregorig dispone di
              apparecchiature moderne e funzionali, sempre al passo con la
              tecnologia, sia dal punto di vista diagnostico che terapeutico.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-teal-600 text-center">
            Il Nostro Team
          </h2>
          <p className="mt-4 text-lg text-gray-600 text-center">
            Un team di professionisti esperti pronti a prendersi cura del tuo
            sorriso.
          </p>
        </div>

        {/* team members*/}
        <TeamMembersList />

        {/* Contact Information Section */}
        <div className="mt-16 max-w-4xl mx-auto ">
          <div className="shadow-md rounded-lg p-8 glassmorphism-card">
            <Image
              src="/assets/icons/contattaci.png"
              height={150}
              width={200}
              alt="logo"
              className="w-fit h-fit"
            />
            <p className="mt-4 text-gray-200">
              Siamo qui per rispondere a tutte le tue domande e preoccupazioni.
              Non esitare a contattarci per maggiori informazioni.
            </p>
            <div className="mt-6">
              <p className="text-white">
                <strong>Email:</strong> gregoriggl@gmail.com
              </p>
              <p className="text-white mt-2">
                <strong>Telefono:</strong> +39 043566198
              </p>
            </div>
          </div>
        </div>
      </div>
      <LiveChat />
      <Footer />
    </div>
  );
};

export default ChiSiamoPage;
