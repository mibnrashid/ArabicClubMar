"use client";

import { useState } from "react";
import { getDb } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  getDocs,
  collection,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { GameState } from "@/types";

import questionsData from "@/data/questions.json";

const questions = questionsData as {
  id: string;
  text: string;
  options: Record<string, string>;
  correctAnswer: string;
}[];

const ARCHIVE_DELAY_MS = 2500;

interface AdminControlsProps {
  gameState: GameState | null;
}

export function AdminControls({ gameState }: AdminControlsProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  async function handleStart() {
    const db = getDb();
    const firstQuestion = questions[0];
    if (!firstQuestion) return;

    await setDoc(
      doc(db, "gameState", "current"),
      {
        currentQuestionId: firstQuestion.id,
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  async function handleStop() {
    const db = getDb();
    await updateDoc(doc(db, "gameState", "current"), {
      isActive: false,
      updatedAt: new Date().toISOString(),
    });
  }

  async function handleNext() {
    if (!gameState || isTransitioning) return;

    const db = getDb();
    const currentQuestionId = gameState.currentQuestionId;
    const currentQuestion = questions.find((q) => q.id === currentQuestionId);
    const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
    const nextQuestion = questions[currentIndex + 1];

    setIsTransitioning(true);

    try {
      await updateDoc(doc(db, "gameState", "current"), {
        isActive: false,
        updatedAt: new Date().toISOString(),
      });

      await new Promise((r) => setTimeout(r, ARCHIVE_DELAY_MS));

      const answersSnap = await getDocs(collection(db, "answers"));
      const toArchive = answersSnap.docs.filter(
        (d) => d.data().questionId === currentQuestionId
      );

      if (currentQuestion) {
        await setDoc(doc(db, "results", currentQuestionId), {
          questionId: currentQuestionId,
          questionText: currentQuestion.text,
          correctAnswer: currentQuestion.correctAnswer,
          options: currentQuestion.options,
          finishedAt: serverTimestamp(),
          totalAnswers: toArchive.length,
        });

        for (const answerDoc of toArchive) {
          const data = answerDoc.data();
          await setDoc(
            doc(db, "results", currentQuestionId, "answers", answerDoc.id),
            {
              username: answerDoc.id,
              answer: data.answer,
              submittedAt: data.submittedAt,
            }
          );
        }
      }

      for (const answerDoc of answersSnap.docs) {
        await deleteDoc(doc(db, "answers", answerDoc.id));
      }

      const nextId = nextQuestion?.id;
      const hasNext = !!nextId;

      await updateDoc(doc(db, "gameState", "current"), {
        currentQuestionId: nextId ?? currentQuestionId,
        isActive: hasNext,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Next question error:", err);
    } finally {
      setIsTransitioning(false);
    }
  }

  const currentQuestion = gameState?.currentQuestionId
    ? questions.find((q) => q.id === gameState.currentQuestionId)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleStart}
          disabled={isTransitioning || (gameState?.isActive ?? false)}
          className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          بدء السؤال
        </button>
        <button
          onClick={handleStop}
          disabled={isTransitioning || !gameState?.isActive}
          className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
        >
          إيقاف
        </button>
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isTransitioning ? "جاري الانتقال..." : "السؤال التالي"}
        </button>
      </div>
      {currentQuestion && gameState?.isActive && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400" dir="rtl">
          السؤال الحالي: {currentQuestion.text}
        </p>
      )}
    </div>
  );
}
