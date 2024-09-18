"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import Image from "next/image";

interface Message {
  text: string;
  sender: "user" | "bot";
  mapEmbed?: boolean; // Add a flag for messages containing a map
}

const faqData = [
  {
    question: "Quali sono gli orari?",
    answer: `Il nostro orario di apertura è: 
    Lunedì : Chiuso 
    Martedì : Chiuso 
    Mercoledì : 08:00 - 13:00 / 14:00 - 20:00 
    Giovedì : 08:00 - 13:00 / 14:00 - 20:00 
    Venerdì : 08:00 - 13:00 / 14:00 - 20:00 
    Sabato : 08:00 - 18:00 - Due sabati al mese 
    Domenica : Chiuso`,
  },
  {
    question: "Come posso contattare lo studio?",
    answer: `Puoi inviarci un'email a\n gregoriggl@libero.it \n
      oppure telefonare al numero: \n +39 043566198.`,
  },
  {
    question: "Quali servizi offrite?",
    answer: `Offriamo diversi servizi:
    implantologia
    Chirurgia Orale
    Odontoiatria conservativa
    Igiene dentale
    Medicina Orale
    Paradontologia`,
  },
  {
    question: "Dove si trova lo studio?",
    answer: "Ci puoi trovare in Borgata Palú 88, nel cuore di Sappada:",
    mapEmbed: true,
  },
];

const LiveChat: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatOpen) {
      const welcomeMessage: Message = {
        text: "Ciao, sono Denty, l'assistente virtuale dello studio Gregorig. Come posso aiutarti oggi?",
        sender: "bot",
      };
      setMessages([welcomeMessage]);
    }
  }, [chatOpen]);

  const handleToggleChat = () => {
    if (chatOpen) {
      setMessages([]);
    }
    setChatOpen(!chatOpen);
  };

  const handleSendMessage = (userInput?: string) => {
    const userMessage = userInput || input;
    if (!userMessage.trim()) return;

    const newUserMessage: Message = { text: userMessage, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    const matchedFAQ = faqData.find((faq) =>
      userMessage.toLowerCase().includes(faq.question.toLowerCase())
    );

    if (matchedFAQ) {
      const botMessage: Message = {
        text: matchedFAQ.answer,
        sender: "bot",
        mapEmbed: matchedFAQ.mapEmbed || false, // Pass the mapEmbed flag if available
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        const optionsMessage: Message = {
          text: "Se hai ancora bisogno di aiuto seleziona una delle opzioni qui sotto:",
          sender: "bot",
        };
        setMessages((prev) => [...prev, optionsMessage]);
      }, 1000);
    } else {
      const defaultReply: Message = {
        text: "Mi dispiace, non ho capito la tua domanda.",
        sender: "bot",
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, defaultReply]);
        const optionsMessage: Message = {
          text: "Seleziona una delle opzioni qui sotto:",
          sender: "bot",
        };
        setMessages((prev) => [...prev, optionsMessage]);
      }, 1000);
    }
  };

  const handleButtonClick = (faqQuestion: string) => {
    handleSendMessage(faqQuestion);
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {chatOpen ? (
        <div className="w-auto h-5/6 max-h-[90vh] bg-white bg-opacity-30 backdrop-blur-lg shadow-lg rounded-lg flex flex-col">
          <div className="bg-blueGreenGradient text-white p-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-lg">Studio Dentistico dr. Gregorig</h2>
            <Image
              src="/assets/icons/cross.png"
              alt="cross"
              width={35}
              height={35}
              className="cursor-pointer text-xl"
              onClick={handleToggleChat}
            />
          </div>
          <div className="flex-1 p-4 overflow-y-auto" ref={chatWindowRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } items-end`}
              >
                {message.sender === "bot" && (
                  <Image
                    src="/assets/icons/denty.png"
                    alt="Bot Avatar"
                    width={32}
                    height={32}
                    className="mr-2"
                  />
                )}
                <div
                  className={`p-3 rounded-lg text-sm max-w-xs whitespace-pre-line ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.text}

                  {/* Conditionally render the map iframe when mapEmbed is true */}
                  {message.mapEmbed && (
                    <div className="mt-2 mx-auto">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2289.482781614495!2d12.67899877552318!3d46.56562115928143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4779e8604d84725f%3A0x2c166aaedd4f4732!2sGregorig%20Dr.%20Gianluca!5e1!3m2!1sit!2sit!4v1726127640342!5m2!1sit!2sit"
                        width="300"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
                {message.sender === "user" && (
                  <Image
                    src="/assets/icons/user.png"
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="ml-2 rounded-full"
                  />
                )}
              </div>
            ))}

            {messages.length > 0 &&
              messages[messages.length - 1].sender === "bot" && (
                <div className="p-2 flex flex-col items-start">
                  {faqData.map((faq, index) => (
                    <button
                      key={index}
                      className="bg-gray-300 hover:bg-blueGreenGradient text-sm text-blue-500 hover:text-white py-2 px-4 rounded-lg mb-2 w-fill mx-auto text-left"
                      onClick={() => handleButtonClick(faq.question)}
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              )}
          </div>

          <div className="p-3 border-t border-gray-300 flex items-center">
            <input
              className="flex-1 border rounded-lg p-2 text-sm focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Scrivi un messaggio..."
            />
            <button
              className="ml-2 text-blue-500"
              onClick={() => handleSendMessage()}
              disabled={!input}
            >
              <IoMdSend className="text-xl" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="bg-blueGreenGradient p-4 rounded-full cursor-pointer shadow-lg chat-icon"
          onClick={handleToggleChat}
        >
          {chatOpen ? (
            <IoMdChatbubbles className="text-white text-3xl" />
          ) : (
            <Image
              src="/assets/icons/denty.png"
              alt=""
              width={50}
              height={50}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LiveChat;
