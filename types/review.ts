// types.ts (create a file or define it in the component)
export interface Review {
    authorName: string;
    profilePhotoUrl: string;
    rating: number;
    text: string;
    relativeTimeDescription: string;
  }
  
  export const reviews = [
    {
      authorName: "Giacomo Massarotto",
      profilePhotoUrl:
        "https://lh3.googleusercontent.com/a-/ALV-UjUzwPdn7YKLSHrFzXVlA-Go6dUCWsNlj2yxYij2tFzVbnoyx_Y=w60-h60-p-rp-mo-ba4-br100", // Replace with actual image URL
      rating: 5,
      text: "Se potessi mettere 6 stelline le metterei! Un vero Dottore con la D maiuscola: pronto nel momento del bisogno e di buon cuore. Lo ringrazio molto per la sua professionalità e per l’aiuto medico ricevuto",
      relativeTimeDescription: "2 settimane fa",
    },
    {
      authorName: "Enzo Giuliattini",
      profilePhotoUrl:
        "https://lh3.googleusercontent.com/a-/ALV-UjWr3AbCEt1UQhsx06amKnCWBYGzJe0H9OS5YvlXuu_OzhWI5cm6pw=w60-h60-p-rp-mo-br100", // Replace with actual image URL
      rating: 5,
      text: "Con un ambiente pulito e accogliente, staff amichevole e un dottore competente e gentile che spiega chiaramente tutte le procedure, mi sono sentito subito a mio agio. Le cure dentali sono state le più indolori che abbia mai provato, rendendo l'esperienza complessivamente eccellente. Lo consiglio a tutti senza esitazioni.",
      relativeTimeDescription: "1 anno fa",
    },
    // Add more reviews as needed
  ];