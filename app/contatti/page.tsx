// app/contatti/page.tsx

import LandbotChatbot from "@/components/Chatbot";
import LiveChat from "@/components/Chatbot";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import React from "react";
import Image from "next/image";

const ContattiPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-black-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Image
            src="/assets/icons/contattaci.png"
            height={150}
            width={200}
            alt="logo"
            className="w-fit h-fit mx-auto"
          />
          <p className="mt-4 text-lg text-gray-600">
            Siamo qui per rispondere alle tue domande e per fissare un
            appuntamento. Non esitare a contattarci!
          </p>
        </div>

        {/* Contact Form and Details */}
        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Invia un Messaggio
            </h2>
            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-gray-700">Nome</label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-lg"
                  placeholder="Il tuo nome"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 p-2 w-full border rounded-lg"
                  placeholder="Il tuo indirizzo email"
                />
              </div>
              <div>
                <label className="block text-gray-700">Messaggio</label>
                <textarea
                  className="mt-1 p-2 w-full border rounded-lg"
                  rows={4}
                  placeholder="Il tuo messaggio"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
              >
                Invia
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800">
              I nostri recapiti
            </h2>
            <p className="mt-4 text-gray-600">
              Non esitare a contattarci tramite i seguenti recapiti. Siamo
              sempre disponibili per assisterti.
            </p>
            <div className="mt-6">
              <p className="text-gray-800">
                <strong>Email:</strong> gregoriggl@gmail.com
              </p>
              <p className="text-gray-800 mt-2">
                <strong>Telefono:</strong> +39 043566198
              </p>
              <p className="text-gray-800 mt-2">
                <strong>Indirizzo:</strong> Borgata Palú 88, 32047 Sappada
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Image
            src="/assets/icons/posizione.png"
            height={150}
            width={200}
            alt="logo"
            className="w-fit h-fit mx-auto"
          />
          <div className="mt-8">
            {/* Replace with your Google Maps Embed URL */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2289.4827816144966!2d12.678998775523182!3d46.56562115928143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4779e8604d84725f%3A0x2c166aaedd4f4732!2sGregorig%20Dr.%20Gianluca!5e1!3m2!1sit!2sit!4v1725141634993!5m2!1sit!2sit"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              className="rounded-lg shadow-md"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
      <LiveChat />
    </div>
  );
};

export default ContattiPage;
