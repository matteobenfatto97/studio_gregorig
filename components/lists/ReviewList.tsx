import React from "react";
import ReviewBox from "../ReviewBox";
import Image from "next/image";

const reviews = [
  {
    authorName: "Giacomo Massarotto",
    profilePhotoUrl: "../assets/images/giacomo.png",
    rating: 5,
    text: "Se potessi mettere 6 stelline le metterei! Un vero Dottore con la D maiuscola: pronto nel momento del bisogno e di buon cuore. Lo ringrazio molto per la sua professionalità e per l’aiuto medico ricevuto",
    relativeTimeDescription: "2 settimane fa",
  },
  {
    authorName: "Enzo Giuliattini",
    profilePhotoUrl: "../assets/images/enzo.png",
    rating: 5,
    text: "Con un ambiente pulito e accogliente, staff amichevole e un dottore competente e gentile che spiega chiaramente tutte le procedure, mi sono sentito subito a mio agio. Le cure dentali sono state le più indolori che abbia mai provato, rendendo l'esperienza complessivamente eccellente. Lo consiglio a tutti senza esitazioni.",
    relativeTimeDescription: "1 anno fa",
  },
  // Add more reviews as needed
];

const ReviewList: React.FC = () => {
  return (
    <div className="w-full py-8">
      <Image
        src="/assets/icons/dicono.png"
        height={150}
        width={200}
        alt="logo"
        className="w-fit h-fit mx-auto mb-4"
      />
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <ReviewBox
              key={index}
              authorName={review.authorName}
              profilePhotoUrl={review.profilePhotoUrl}
              rating={review.rating}
              text={review.text}
              relativeTimeDescription={review.relativeTimeDescription}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
