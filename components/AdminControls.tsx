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
  const [isResetting, setIsResetting] = useState(false);

  async function handleStart() {
    const db = getDb();
    const firstQuestion = questions[0];
    if (!firstQuestion) return;

    await setDoc(
      doc(db, "gameState", "current"),
      {
        currentQuestionId: firstQuestion.id,
        isActive: true,
        hasStarted: true,
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

  async function handleReset() {
    if (isResetting || isTransitioning) return;
    if (!confirm("هل أنت متأكد؟ سيتم حذف جميع الإجابات والنتائج وبدء من جديد. الحسابات ستبقى.")) return;

    setIsResetting(true);
    const db = getDb();
    const firstQuestion = questions[0];

    try {
      const resultsSnap = await getDocs(collection(db, "results"));
      for (const resultDoc of resultsSnap.docs) {
        const answersSnap = await getDocs(
          collection(db, "results", resultDoc.id, "answers")
        );
        for (const answerDoc of answersSnap.docs) {
          await deleteDoc(doc(db, "results", resultDoc.id, "answers", answerDoc.id));
        }
        await deleteDoc(doc(db, "results", resultDoc.id));
      }

      const answersSnap = await getDocs(collection(db, "answers"));
      for (const answerDoc of answersSnap.docs) {
        await deleteDoc(doc(db, "answers", answerDoc.id));
      }

      await setDoc(
        doc(db, "gameState", "current"),
        {
          currentQuestionId: firstQuestion?.id ?? "q1",
          isActive: false,
          hasStarted: false,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Reset error:", err);
    } finally {
      setIsResetting(false);
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
          className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500 disabled:opacity-50"
        >
          بدء السؤال
        </button>
        <button
          onClick={handleStop}
          disabled={isTransitioning || !gameState?.isActive}
          className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-500 disabled:opacity-50"
        >
          إيقاف
        </button>
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400 disabled:opacity-50"
        >
          {isTransitioning ? "جاري الانتقال..." : "السؤال التالي"}
        </button>
        <button
          onClick={handleReset}
          disabled={isResetting || isTransitioning}
          className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-500 disabled:opacity-50"
        >
          {isResetting ? "جاري إعادة التعيين..." : "إعادة تعيين الكل"}
        </button>
      </div>
    </div>
  );
}
