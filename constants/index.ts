export const GenderOptions = ["uomo", "donna"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "uomo" as Gender,
  address: "",
  occupation: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Carta d'identità",
  "Patente",
  "Passaporto",
];

export const Doctors = [
  {
    image: "/assets/team/dr.Gregorig.png",
    name: "Dr. Gianluca Gregorig",
  },
  {
    image: "/assets/team/dr.ssaCarla.png",
    name: "Dr.ssa Carla Fonda",
  },
  {
    image: "/assets/team/dr.ssaAnna.png",
    name: "Dr.ssa Anna di Piazza",
  },
];

export const StatusIcon = {
  pending: "/assets/icons/pending.svg",
  scheduled: "/assets/icons/check.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
