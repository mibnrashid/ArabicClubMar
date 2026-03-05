"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AdminControls } from "@/components/AdminControls";
import { LiveResults } from "@/components/LiveResults";
import type { GameState } from "@/types";

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

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          لوحة التحكم
        </h1>
        <AdminControls gameState={gameState} />
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
