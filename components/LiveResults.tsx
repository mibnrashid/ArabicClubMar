"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

interface LiveResultsProps {
  currentQuestionId: string | null;
}

interface AnswerCounts {
  A: number;
  B: number;
  C: number;
  D: number;
  total: number;
}

export function LiveResults({ currentQuestionId }: LiveResultsProps) {
  const [counts, setCounts] = useState<AnswerCounts>({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    total: 0,
  });

  useEffect(() => {
    if (!currentQuestionId) return;

    const db = getDb();
    const q = query(
      collection(db, "answers"),
      where("questionId", "==", currentQuestionId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const newCounts: AnswerCounts = { A: 0, B: 0, C: 0, D: 0, total: 0 };

      snap.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const answer = data.answer as string;
        if (["A", "B", "C", "D"].includes(answer)) {
          newCounts[answer as keyof Omit<AnswerCounts, "total">]++;
        }
        newCounts.total++;
      });

      setCounts(newCounts);
    });

    return () => unsub();
  }, [currentQuestionId]);

  if (!currentQuestionId || counts.total === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-2 font-semibold">توزيع الإجابات</h3>
        <p className="text-sm text-zinc-500">لا توجد إجابات بعد</p>
      </div>
    );
  }

  const options = ["A", "B", "C", "D"] as const;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 font-semibold">توزيع الإجابات ({counts.total} إجابة)</h3>
      <div className="space-y-2">
        {options.map((opt) => {
          const count = counts[opt];
          const pct = counts.total > 0 ? Math.round((count / counts.total) * 100) : 0;
          return (
            <div key={opt} className="flex items-center gap-2">
              <span className="w-6 font-medium">{opt}</span>
              <div className="flex-1 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-6 rounded bg-blue-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-12 text-sm">
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
