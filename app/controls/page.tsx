"use client";

import { useState, useEffect } from "react";
import { questions } from "../questions";

export default function Controls() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize Broadcast Channel
  useEffect(() => {
    const bc = new BroadcastChannel("family_feud_controller");
    setChannel(bc);
    return () => bc.close();
  }, []);

  // Reset local revealed state when question changes
  useEffect(() => {
    setRevealed(new Array(currentQuestion.answers.length).fill(false));
  }, [currentQuestionIndex, currentQuestion.answers.length]);

  const sendCommand = (action: string, payload?: any) => {
    channel?.postMessage({ action, payload });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      sendCommand("NEXT");
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      sendCommand("PREV");
    }
  };

  

    const handleReveal = (index: number) => {

      const newRevealed = [...revealed];

      newRevealed[index] = !newRevealed[index];

      setRevealed(newRevealed);

      sendCommand("REVEAL", index);

    };

  

    const handleStrike = (strikeNumber: number) => {

      sendCommand("STRIKE", strikeNumber);

    };

  

    return (

      <div className="min-h-screen bg-gray-900 p-8 text-white font-sans">

        <h1 className="mb-8 text-3xl font-bold text-yellow-400">Game Controller</h1>

        

        <div className="mb-8 flex gap-4">

          <button

            onClick={handlePrev}

            disabled={currentQuestionIndex === 0}

            className="rounded bg-blue-600 px-4 py-2 font-bold hover:bg-blue-500 disabled:opacity-50"

          >

            Previous Question

          </button>

          <button

            onClick={handleNext}

            disabled={currentQuestionIndex === questions.length - 1}

            className="rounded bg-blue-600 px-4 py-2 font-bold hover:bg-blue-500 disabled:opacity-50"

          >

            Next Question

          </button>

        </div>

  

        <div className="mb-8 flex gap-4">

          <button

            onClick={() => handleStrike(1)}

            className="rounded bg-red-600 px-4 py-2 font-bold hover:bg-red-500"

          >

            Strike 1

          </button>

          <button

            onClick={() => handleStrike(2)}

            className="rounded bg-red-600 px-4 py-2 font-bold hover:bg-red-500"

          >

            Strike 2

          </button>

          <button

            onClick={() => handleStrike(3)}

            className="rounded bg-red-600 px-4 py-2 font-bold hover:bg-red-500"

          >

            Strike 3

          </button>

        </div>

  

        <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">

          <h2 className="mb-4 text-xl font-bold text-gray-300">

            Q{currentQuestionIndex + 1}: {currentQuestion.text}

          </h2>

          

          <div className="space-y-2">

            {currentQuestion.answers.map((answer, index) => (

              <div key={index} className="flex items-center justify-between rounded bg-gray-700 p-3">

                <span className="font-medium text-lg">

                  {answer.text} ({answer.points})

                </span>

                <button

                  onClick={() => handleReveal(index)}

                  className={`min-w-[100px] rounded px-3 py-1 font-bold transition-colors ${

                    revealed[index]

                      ? "bg-red-600 hover:bg-red-500"

                      : "bg-green-600 hover:bg-green-500"

                  }`}

                >

                  {revealed[index] ? "Hide" : "Reveal"}

                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    );

  }

  