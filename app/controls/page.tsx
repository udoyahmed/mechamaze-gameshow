"use client";

import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { questions } from "../questions";

export default function Controls() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<any>(null);

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize Pusher
  useEffect(() => {
    console.log("Control: Initializing Pusher");
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
    });
    pusherRef.current = pusher;

    const channel = pusher.subscribe("private-mechamaze");
    channelRef.current = channel;
    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Control: Subscribed to private-mechamaze");
    });
    channel.bind("pusher:subscription_error", (error: any) => {
      console.log("Control: Subscription error", error);
    });

    return () => {
      pusher.unsubscribe("private-mechamaze");
      pusher.disconnect();
    };
  }, []);

  // Reset local revealed state when question changes
  useEffect(() => {
    setRevealed(new Array(currentQuestion.answers.length).fill(false));
  }, [currentQuestionIndex, currentQuestion.answers.length]);

  const sendCommand = (action: string, payload?: any) => {
    if (channelRef.current) {
      channelRef.current.trigger("client-command", { action, payload });
      console.log("Control: Sent command", action, payload);
    }
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

      <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-white font-sans">

        <h1 className="mb-8 text-2xl md:text-3xl font-bold text-yellow-400">Game Controller</h1>

        

        <div className="mb-8 flex flex-col sm:flex-row gap-4">

          <button

            onClick={handlePrev}

            disabled={currentQuestionIndex === 0}

            className="rounded bg-blue-600 px-4 py-2 font-bold hover:bg-blue-500 disabled:opacity-50 flex-1 sm:flex-none"

          >

            Previous Question

          </button>

          <button

            onClick={handleNext}

            disabled={currentQuestionIndex === questions.length - 1}

            className="rounded bg-blue-600 px-4 py-2 font-bold hover:bg-blue-500 disabled:opacity-50 flex-1 sm:flex-none"

          >

            Next Question

          </button>

        </div>

  

        <div className="mb-8 flex flex-col sm:flex-row gap-4">

          <button

            onClick={() => handleStrike(1)}

            className="rounded bg-red-600 px-4 py-2 font-bold hover:bg-red-500 flex-1 sm:flex-none"

          >

            Strike 1

          </button>

          <button

            onClick={() => handleStrike(2)}

            className="rounded bg-red-600 px-4 py-2 font-bold hover:bg-red-500 flex-1 sm:flex-none"

          >

            Strike 2

          </button>

          <button

            onClick={() => handleStrike(3)}

            className="rounded bg-red-600 px-4 py-2 font-bold hover:bg-red-500 flex-1 sm:flex-none"

          >

            Strike 3

          </button>

        </div>

  

        <div className="rounded-lg bg-gray-800 p-4 md:p-6 border border-gray-700">

          <h2 className="mb-4 text-lg md:text-xl font-bold text-gray-300">

            Q{currentQuestionIndex + 1}: {currentQuestion.text}

          </h2>

          

          <div className="space-y-2">

            {currentQuestion.answers.map((answer, index) => (

              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded bg-gray-700 p-3 gap-2">

                <span className="font-medium text-base md:text-lg">

                  {answer.text} ({answer.points})

                </span>

                <button

                  onClick={() => handleReveal(index)}

                  className={`min-w-[100px] rounded px-3 py-1 font-bold transition-colors self-start sm:self-auto ${

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

  