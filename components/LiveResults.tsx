"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

interface LiveResultsProps {
  currentQuestionId: string | null;
  optionKeys?: string[];
}

export function LiveResults({ currentQuestionId, optionKeys = [] }: LiveResultsProps) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!currentQuestionId) return;

    const db = getDb();
    const q = query(
      collection(db, "answers"),
      where("questionId", "==", currentQuestionId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const newCounts: Record<string, number> = {};
      let newTotal = 0;

      snap.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const answer = data.answer as string;
        newCounts[answer] = (newCounts[answer] ?? 0) + 1;
        newTotal++;
      });

      setCounts(newCounts);
      setTotal(newTotal);
    });

    return () => unsub();
  }, [currentQuestionId]);

  const options = optionKeys.length > 0 ? optionKeys : Object.keys(counts).sort();

  if (!currentQuestionId || total === 0) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-[#131c2e] p-4">
        <h3 className="mb-2 font-semibold text-slate-100">توزيع الإجابات</h3>
        <p className="text-sm text-slate-500">لا توجد إجابات بعد</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700/50 bg-[#131c2e] p-4">
      <h3 className="mb-3 font-semibold text-slate-100">توزيع الإجابات ({total} إجابة)</h3>
      <div className="space-y-2">
        {options.map((opt) => {
          const count = counts[opt] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={opt} className="flex items-center gap-2">
              <span className="w-6 font-medium text-slate-400">{opt}</span>
              <div className="flex-1 overflow-hidden rounded bg-slate-800">
                <div
                  className="h-6 rounded bg-blue-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-12 text-sm text-slate-400">
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
