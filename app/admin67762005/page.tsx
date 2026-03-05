"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AdminControls } from "@/components/AdminControls";
import { ActiveQuestionDisplay } from "@/components/ActiveQuestionDisplay";
import { LiveResults } from "@/components/LiveResults";
import { ActivityResults } from "@/components/ActivityResults";
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

  const isFirstQuestion =
    gameState?.currentQuestionId &&
    questions.findIndex((q) => q.id === gameState.currentQuestionId) === 0;

  const isLastQuestion =
    gameState?.currentQuestionId &&
    questions.findIndex((q) => q.id === gameState.currentQuestionId) === questions.length - 1;

  const isFinished =
    !gameState?.isActive && isLastQuestion;

  const isNotStarted =
    !gameState?.isActive && isFirstQuestion && !gameState?.hasStarted;

  return (
    <div className="min-h-screen bg-[#0c1222] p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-slate-100">
          لوحة التحكم
        </h1>
        {isFinished && (
          <div className="rounded-lg border border-green-600/50 bg-green-950/30 p-6 text-center">
            <p className="text-2xl font-bold text-green-400">
              تمت الإنتهاء
            </p>
          </div>
        )}
        <AdminControls gameState={gameState} />
        {isNotStarted && (
          <div className="rounded-lg border border-slate-700/50 bg-[#131c2e] p-6 text-center">
            <p className="text-xl font-medium text-slate-400">
              لم تبدأ بعد
            </p>
          </div>
        )}
        {currentQuestion && !isNotStarted && (
          <ActiveQuestionDisplay
            question={currentQuestion}
            showCorrectAnswer={!gameState?.isActive}
          />
        )}
        <LiveResults
          currentQuestionId={gameState?.currentQuestionId ?? null}
          optionKeys={currentQuestion ? Object.keys(currentQuestion.options).sort() : undefined}
        />
        <ActivityResults />
        <a
          href="/play"
          className="inline-block text-sm text-blue-400 hover:text-blue-300 hover:underline"
        >
          العودة للعب
        </a>
      </div>
    </div>
  );
}
