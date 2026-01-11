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
    text: "Name something you do before going to bed",
    answers: [
      { text: "Brush Teeth", points: 35 },
      { text: "Read", points: 20 },
      { text: "Watch TV", points: 15 },
      { text: "Set Alarm", points: 10 },
      { text: "Pray", points: 8 },
      { text: "Drink Water", points: 5 },
      { text: "Lock Doors", points: 4 },
      { text: "Check Phone", points: 3 },
    ],
  },
  {
    id: 2,
    text: "Name a reason people might be late for work",
    answers: [
      { text: "Traffic", points: 40 },
      { text: "Overslept", points: 25 },
      { text: "Car Trouble", points: 15 },
      { text: "Weather", points: 10 },
      { text: "Public Transport", points: 5 },
      { text: "Sick Child", points: 3 },
      { text: "Forgot Something", points: 2 },
    ],
  },
  {
    id: 3,
    text: "Name something you find in a glove box",
    answers: [
      { text: "Registration/Insurance", points: 45 },
      { text: "Gloves", points: 20 },
      { text: "Flashlight", points: 12 },
      { text: "Napkins", points: 8 },
      { text: "Manual", points: 6 },
      { text: "Tire Gauge", points: 4 },
      { text: "Candy/Gum", points: 3 },
      { text: "Pens", points: 2 },
    ],
  },
];