export type Answer = {
  text: string;
  points: number;
};

export type Question = {
  id: number;
  text: string;
  answers: Answer[];
};

export const questions: Question[] = [
  {
    id: 1,
    text: "Career choice",
    answers: [
      { text: "Research/Higher Studies/Masters", points: 35 },
      { text: "BCS/Govt Job", points: 20 },
      { text: "Corporate/Private Sector", points: 15 },
      { text: "Unemployed/Undecided/Tuition", points: 10 },
      { text: "Business/Entrepreneur", points: 6 },
    ],
  },
  {
    id: 2,
    text: "CSBr Gurutto",
    answers: [
      { text: "Oporishim", points: 27 },
      { text: "TF Pichano", points: 20 },
      { text: "Nai", points: 18 },
      { text: "Entertainment", points: 15 },
      { text: "Espose", points: 12 },
    ],
  },
  {
    id: 3,
    text: "PL e ki korte pochondo koro",
    answers: [
      { text: "Ghumate", points: 42 },
      { text: "Games", points: 31 },
      { text: "Time Waste/Reels/Social Media", points: 13 },
      { text: "Poralekha", points: 9 },
      { text: "Tour", points: 3 },
    ],
  },
  {
    id: 4,
    text: "Term Final pichanor karon",
    answers: [
      { text: "Boycott", points: 68 },
      { text: "Lack of Prep", points: 11 },
      { text: "Tuition", points: 8 },
      { text: "CSB", points: 6 },
      { text: "Tradition", points: 3 },
    ],
  },
  {
    id: 5,
    text: "First thing in mind about ME Drawing",
    answers: [
      { text: "3:1/3mm,1mm", points: 77 },
      { text: "T scale", points: 8 },
      { text: "Arrohead", points: 6 },
      { text: "50% thickness/Dimension line", points: 4 },
      { text: "Hatch line", points: 3 },
    ],
  },
  {
    id: 6,
    text: "Poralekhar material er source",
    answers: [
      { text: "Drive link/Chotha/Senior", points: 45 },
      { text: "Friends", points: 35 },
      { text: "Chatgpt", points: 10 },
      { text: "Youtube", points: 4 },
      { text: "Self/Book", points: 3 },
    ],
  },
];