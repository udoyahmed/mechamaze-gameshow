"use client";

import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { questions } from "./questions";

const StrikeDisplay = ({ strikes }: { strikes: number }) => {
  if (strikes === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex gap-4">
        {Array.from({ length: strikes }).map((_, i) => (
          <div key={i} className="text-[15rem] font-bold text-red-500 animate-pulse">
            X
          </div>
        ))}
      </div>
    </div>
  );
};

export default function GameBoard() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [strikes, setStrikes] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const pusherRef = useRef<Pusher | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize Pusher
  useEffect(() => {
    console.log("Main: Initializing Pusher");
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
    });
    pusherRef.current = pusher;

    const channel = pusher.subscribe("private-mechamaze");
    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Main: Subscribed to private-mechamaze");
    });
    channel.bind("pusher:subscription_error", (error: any) => {
      console.log("Main: Subscription error", error);
    });
    channel.bind("client-command", (data: { action: string; payload?: any }) => {
      console.log("Main: Received command", data);
      const { action, payload } = data;
      if (action === "NEXT") {
        setCurrentQuestionIndex((prev) => (prev < questions.length - 1 ? prev + 1 : prev));
      } else if (action === "PREV") {
        setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (action === "REVEAL") {
        setRevealed((prev) => {
          const newRevealed = [...prev];
          newRevealed[payload] = !newRevealed[payload];
          return newRevealed;
        });
      } else if (action === "STRIKE") {
        setStrikes(payload);
        setTimeout(() => setStrikes(0), 3000); // Hide after 3 seconds
      } else if (action === "START") {
        setGameStarted(true);
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("private-mechamaze");
      pusher.disconnect();
    };
  }, []);

  useEffect(() => {
    setRevealed(new Array(currentQuestion.answers.length).fill(false));
  }, [currentQuestionIndex, currentQuestion.answers.length]);

  // Calculate total score of currently revealed answers
  const currentScore = currentQuestion.answers.reduce((acc, answer, index) => {
    return revealed[index] ? acc + answer.points : acc;
  }, 0);

  return (
    <>
      {!gameStarted && (
        <main className="flex min-h-screen flex-col items-center justify-center bg-blue-950 p-4 font-sans text-white">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-yellow-400 mb-8 drop-shadow-lg">
              MECHAMAZE
            </h1>
            <p className="text-xl text-blue-200">
              Game Show
            </p>
          </div>
        </main>
      )}
      {gameStarted && (
        <main className="flex min-h-screen flex-col items-center justify-center bg-blue-950 p-4 font-sans text-white">
          <StrikeDisplay strikes={strikes} />
          <div className="w-full max-w-5xl space-y-6">
            {/* Header / Score Board */}
            <div className="flex items-center justify-between rounded-lg border-2 border-yellow-400 bg-blue-900 p-4 shadow-lg">
              <div className="text-2xl font-bold text-yellow-400">MECHAMAZE</div>
              <div className="text-xl font-bold">
                BOARD SCORE: <span className="text-yellow-400">{currentScore}</span>
              </div>
            </div>

            {/* Question Display */}
            <div className="rounded-xl border-4 border-blue-400 bg-blue-800 p-8 text-center shadow-2xl">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-white drop-shadow-md md:text-4xl">
                {currentQuestion.text}
              </h1>
            </div>

            {/* Answers Grid */}
            <div className="grid grid-cols-1 gap-4">
              {/* Render actual answers */}
              {currentQuestion.answers.map((answer, index) => (
                <div
                  key={index}
                  className="relative h-20"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-md border-2 border-white shadow-lg">
                    {revealed[index] ? (
                      // Revealed State
                      <div className="flex h-full items-center justify-between bg-gradient-to-b from-blue-600 to-blue-800 px-4">
                        <span className="text-lg font-bold uppercase text-white drop-shadow-sm md:text-xl">
                          {answer.text}
                        </span>
                        <div className="flex h-12 w-14 items-center justify-center border-2 border-white bg-blue-950 text-xl font-bold text-white shadow-inner">
                          {answer.points}
                        </div>
                      </div>
                    ) : (
                      // Hidden State
                      <div className="flex h-full items-center justify-center bg-gradient-to-b from-blue-700 to-blue-900">
                        <div className="flex h-10 w-14 items-center justify-center rounded-full border-2 border-blue-400 bg-blue-900 text-xl font-bold text-white shadow-inner">
                          {index + 1}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Empty slots to maintain grid structure (optional, usually 8 slots total) */}
              {Array.from({ length: Math.max(0, 5 - currentQuestion.answers.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 rounded-md border-2 border-blue-900/30 bg-blue-900/20"></div>
              ))}
            </div>


          </div>
        </main>
      )}
    </>
  );
}
