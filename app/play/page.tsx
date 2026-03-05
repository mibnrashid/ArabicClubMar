"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthEntry } from "@/components/AuthEntry";
import { ActivityButton } from "@/components/ActivityButton";
import { STORAGE_KEYS } from "@/components/RegistrationForm";
import { WaitingScreen } from "@/components/WaitingScreen";
import { QuestionCard } from "@/components/QuestionCard";
import { AnswerConfirmation } from "@/components/AnswerConfirmation";
import { deriveUIState, getQuestionById } from "@/lib/gameLogic";
import type { GameState, AnswerDoc } from "@/types";

import questionsData from "@/data/questions.json";

const questions = questionsData as { id: string; text: string; options: Record<string, string>; correctAnswer: string }[];

export default function PlayPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [realName, setRealName] = useState<string | null>(null);

  useEffect(() => {
    const u = localStorage.getItem(STORAGE_KEYS.username);
    const r = localStorage.getItem(STORAGE_KEYS.realName);
    if (u && r) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- sync with localStorage on mount */
      setUsername(u);
      setRealName(r);
    }
  }, []);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [answersDoc, setAnswersDoc] = useState<AnswerDoc | null>(null);

  useEffect(() => {
    const db = getDb();
    const unsubGameState = onSnapshot(
      doc(db, "gameState", "current"),
      (snap) => {
        if (snap.exists()) {
          setGameState(snap.data() as GameState);
        } else {
          setGameState(null);
        }
      },
      (err) => {
        console.error("gameState listener error:", err);
      }
    );

    return () => unsubGameState();
  }, []);

  useEffect(() => {
    if (!username) return;

    const db = getDb();
    const unsubAnswers = onSnapshot(
      doc(db, "answers", username),
      (snap) => {
        if (snap.exists()) {
          setAnswersDoc(snap.data() as AnswerDoc);
        } else {
          setAnswersDoc(null);
        }
      },
      (err) => {
        console.error("answers listener error:", err);
      }
    );

    return () => unsubAnswers();
  }, [username]);

  const isRegistered = !!username && !!realName;
  const uiState = deriveUIState(isRegistered, gameState, answersDoc);

  function handleRegistered(newUsername: string, newRealName: string) {
    setUsername(newUsername);
    setRealName(newRealName);
  }

  function handleAnswered() {
    // Listener will update answersDoc; this allows QuestionCard to clear submit state
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.username);
    localStorage.removeItem(STORAGE_KEYS.realName);
    setUsername(null);
    setRealName(null);
  }

  const activityButton = gameState?.activityEnabled && isRegistered ? <ActivityButton /> : null;

  if (uiState === "not_registered") {
    return <AuthEntry onAuthenticated={handleRegistered} />;
  }

  if (uiState === "waiting") {
    return (
      <>
        {activityButton}
        <WaitingScreen onLogout={handleLogout} />
      </>
    );
  }

  const question = gameState?.currentQuestionId
    ? getQuestionById(questions, gameState.currentQuestionId)
    : null;

  if (uiState === "active_not_answered" && question) {
    return (
      <>
        {activityButton}
        <QuestionCard
          question={question}
          username={username!}
          questionId={gameState!.currentQuestionId}
          onAnswered={handleAnswered}
          onLogout={handleLogout}
        />
      </>
    );
  }

  if (uiState === "answered" && question && answersDoc) {
    return (
      <>
        {activityButton}
        <AnswerConfirmation
          question={question}
          userAnswer={answersDoc.answer}
          onLogout={handleLogout}
        />
      </>
    );
  }

  return (
    <>
      {activityButton}
      <WaitingScreen onLogout={handleLogout} />
    </>
  );
}
