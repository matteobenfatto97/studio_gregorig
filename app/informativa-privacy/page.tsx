import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="p-6 md:p-12 lg:p-24 text-gray-800">
        <div className="max-w-4xl mx-auto shadow-md rounded-lg p-8 md:p-12 glassmorphism-card">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-teal-600">
            INFORMATIVA SUL TRATTAMENTO DEI DATI PERSONALI
          </h1>
          <p className="text-white mb-8 italic">
            (Ex art. 13 reg. UE 2016/679 e del D.lgs 196/2003 alla luce del
            D.lgs. 101/2018)
          </p>

          <p className="text-white mb-6">
            Gentile Interessato, di seguito le forniamo alcune informazioni che
            è necessario portare alla sua conoscenza, non solo per ottemperare
            agli obblighi di legge, ma anche perché la trasparenza e la
            correttezza nei confronti degli interessati è parte fondante della
            nostra attività.
          </p>

          <h3 className="text-xl font-semibold text-teal-600 mb-4">
            Il Titolare del Trattamento
          </h3>
          <p className="text-white mb-4">
            Il Titolare del Trattamento dei suoi dati personali è Studio
            Gregorig, responsabile nei suoi confronti del legittimo e corretto
            uso dei suoi dati personali e che potrà contattare per qualsiasi
            informazione o richiesta ai seguenti recapiti:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white mb-6">
            <li>
              <strong>Titolare del Trattamento:</strong> Studio Gregorig
            </li>
            <li>
              <strong>Sede:</strong> Borgata Palú 88, 32047 Sappada (UD)
            </li>
            <li>
              <strong>Telefono:</strong> +39 043566198
            </li>
            <li>
              <strong>E-mail:</strong> gregoriggl@gmail.com
            </li>
            <li>
              <strong>Sito Web:</strong> www.studiogregorig.it
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-teal-600 mb-4">
            FINALITÀ DEL TRATTAMENTO
          </h3>
          <p className="text-white mb-6">
            I sistemi informatici e le procedure software che regolano il
            funzionamento di questo sito acquisiscono i dati di navigazione come
            indirizzi IP, nomi a dominio, orari della richiesta e altri
            parametri relativi al sistema operativo e al browser utilizzati.
          </p>

          <h3 className="text-xl font-semibold text-teal-600 mb-4">
            INFORMAZIONI PERSONALI CHE RACCOGLIAMO
          </h3>
          <p className="text-white mb-4">
            In ogni occasione di contatto o interazione con il visitatore
            potrebbero venire raccolte alcune informazioni personali quali:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white mb-6">
            <li>Nome</li>
            <li>Cognome</li>
            <li>Telefono</li>
            <li>E-mail</li>
            <li>Messaggio</li>
            <li>Altri dati forniti volontariamente dall'utente</li>
          </ul>

          <h3 className="text-xl font-semibold text-teal-600 mb-4">
            INFORMAZIONI CHE RACCOGLIAMO DA TERZE PARTI
          </h3>
          <p className="text-white mb-6">
            Durante la navigazione raccogliamo informazioni standard
            sull’accesso e dettagli del modello di comportamento degli utenti.
          </p>

          <h3 className="text-xl font-semibold text-teal-600 mb-4">
            TEMPI DI CONSERVAZIONE
          </h3>
          <p className="text-white mb-6">
            I dati raccolti verranno conservati per il tempo necessario alla
            realizzazione delle finalità sopra indicate e, quindi, al servizio
            offerto o alle specifiche norme di legge.
          </p>

          <h3 className="text-xl font-semibold text-teal-600 mb-4">
            TRASFERIMENTO DATI EXTRA UE
          </h3>
          <p className="text-white mb-6">
            Il trattamento dei dati personali sarà circoscritto ai Paesi facenti
            parte dell’Unione Europea.
          </p>

          <h3 className="text-xl font-semibold text-teal-600 mb-4">
            DIRITTI E REVOCA DEL CONSENSO
          </h3>
          <p className="text-white mb-6">
            Il GDPR 679/2016 riconosce all’interessato diversi diritti come il
            diritto di accesso, rettifica, cancellazione, e opposizione al
            trattamento dei dati.
          </p>

          <h3 className="text-xl font-semibold text-teal-600 mb-4">
            MINORI DI ANNI 14
          </h3>
          <p className="text-white mb-6">
            Se venissimo a conoscenza di dati personali di un minore di anni 14,
            da lui forniti senza l’autorizzazione dei genitori, provvederemmo ad
            eliminare tali informazioni immediatamente.
          </p>

          <h3 className="text-xl font-semibold text-teal-600 mb-4">
            DIFESA IN GIUDIZIO
          </h3>
          <p className="text-white mb-6">
            I dati personali potrebbero essere utilizzati per la difesa in
            giudizio da parte del Titolare.
          </p>

          <p className="text-gray-600 italic text-right">
            <strong>Ultimo aggiornamento:</strong> 18/09/2024
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
