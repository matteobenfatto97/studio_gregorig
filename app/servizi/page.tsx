import Image from "next/image";
import Link from "next/link";

import { PatientForm } from "@/components/forms/PatientForm";

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

import LiveChat from "@/components/Chatbot";
import ServicesInteractiveSection from "@/components/lists/ServicesInteractiveSection";
import FaqSection from "@/components/ui/FaqSection";

const ServiziPage = ({ searchParams }: SearchParamProps) => {
  return (
    <div>
      <Header />
      <div className="flex h-screen max-h-screen">
        <section className="remove-scrollbar container my-auto">
          <div className="sub-container max-w-[496px]">
            <PatientForm />
          </div>
        </section>

        <Image
          src="/assets/images/onboarding.jpeg"
          height={1000}
          width={1000}
          alt="patient"
          className="side-img max-w-[50%]"
        />
      </div>

      {/* First New Section */}

      {/* Second New Section */}
      <section className="bg-blue-500 text-white py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold mx-auto text center">
            Perchè scegliere noi?
          </h1>
          <h2 className="text-2xl font-bold"></h2>
          <p className="mt-4"></p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="flex-1 max-w-xs">
              <h3 className="text-xl font-semibold">
                Esperienza e Tecnologia al tuo Servizio
              </h3>
              <p>
                Garantiamo il servizio che noi stessi vorremmo ricevere,
                mettendo a disposizione la conoscenza acquisita in questi anni e
                le ultime tecnologie e tecniche nel campo odontoiatrico.
              </p>
            </div>
            <div className="flex-1 max-w-xs">
              <h3 className="text-xl font-semibold">
                Prevenire è meglio che Curare
              </h3>
              <p>
                Una volta persi, i denti naturali non ricrescono più ed è per
                questo che anche solo una visita o una pulizia dei denti può
                risultare essenziale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* second section*/}
      <ServicesInteractiveSection />
      {/* third section */}
      <FaqSection />
      <LiveChat />
      <Footer />
    </div>
  );
};

export default ServiziPage;
