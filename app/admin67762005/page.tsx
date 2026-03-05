"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AdminControls } from "@/components/AdminControls";
import { ActiveQuestionDisplay } from "@/components/ActiveQuestionDisplay";
import { LiveResults } from "@/components/LiveResults";
import { getQuestionById } from "@/lib/gameLogic";
import type { GameState } from "@/types";

import questionsData from "@/data/questions.json";

const questions = questionsData as { id: string; text: string; options: Record<string, string>; correctAnswer: string }[];

export default function AdminPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const db = getDb();
    const unsub = onSnapshot(
      doc(db, "gameState", "current"),
      (snap) => {
        if (snap.exists()) {
          setGameState(snap.data() as GameState);
        } else {
          setGameState(null);
        }
      },
      (err) => console.error("gameState listener error:", err)
    );

    return () => unsub();
  }, []);

  const currentQuestion =
    gameState?.currentQuestionId
      ? getQuestionById(questions, gameState.currentQuestionId)
      : null;

  const isLastQuestion =
    gameState?.currentQuestionId &&
    questions.findIndex((q) => q.id === gameState.currentQuestionId) === questions.length - 1;

  const isFinished =
    !gameState?.isActive && isLastQuestion;

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          لوحة التحكم
        </h1>
        {isFinished && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-950/30">
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              تمت الإنتهاء
            </p>
          </div>
        )}
        <AdminControls gameState={gameState} />
        {currentQuestion && (
          <ActiveQuestionDisplay
            question={currentQuestion}
            showCorrectAnswer={!gameState?.isActive}
          />
        )}
        <LiveResults currentQuestionId={gameState?.currentQuestionId ?? null} />
        <a
          href="/play"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          العودة للعب
        </a>
      </div>
    </div>
  );
}
