"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

import activityItemsData from "@/data/activityItems.json";

const activityItems = activityItemsData as { id: string; image: string }[];

interface ItemCounts {
  like: number;
  dislike: number;
}

export function ActivityResults() {
  const [counts, setCounts] = useState<Record<string, ItemCounts>>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const db = getDb();
    const unsub = onSnapshot(collection(db, "activityAnswers"), (snap) => {
      const newCounts: Record<string, ItemCounts> = {};
      activityItems.forEach((item) => {
        newCounts[item.id] = { like: 0, dislike: 0 };
      });

      snap.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const answers = data.answers as Record<string, "like" | "dislike">;
        if (answers) {
          Object.entries(answers).forEach(([id, value]) => {
            if (newCounts[id]) {
              if (value === "like") newCounts[id].like++;
              else if (value === "dislike") newCounts[id].dislike++;
            }
          });
        }
      });

      setCounts(newCounts);
      setTotal(snap.size);
    });

    return () => unsub();
  }, []);

  if (total === 0) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-[#131c2e] p-4">
        <h3 className="mb-2 font-semibold text-slate-100">نتائج النشاط</h3>
        <p className="text-sm text-slate-500">لا توجد إجابات بعد</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700/50 bg-[#131c2e] p-4">
      <h3 className="mb-3 font-semibold text-slate-100">
        نتائج النشاط ({total} مشارك)
      </h3>
      <div className="space-y-3">
        {activityItems.map((item) => {
          const c = counts[item.id] ?? { like: 0, dislike: 0 };
          const sum = c.like + c.dislike;
          const likePct = sum > 0 ? Math.round((c.like / sum) * 100) : 0;
          const dislikePct = sum > 0 ? Math.round((c.dislike / sum) * 100) : 0;
          return (
            <div
              key={item.id}
              className="rounded-lg border border-slate-600 bg-[#1a2744] p-3"
            >
              <p className="mb-2 text-sm font-medium text-slate-300">
                صورة {item.id}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👍</span>
                  <span className="text-slate-400">
                    {c.like} ({likePct}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">👎</span>
                  <span className="text-slate-400">
                    {c.dislike} ({dislikePct}%)
                  </span>
                </div>
              </div>
              <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="bg-green-600"
                  style={{ width: `${likePct}%` }}
                />
                <div
                  className="bg-red-600"
                  style={{ width: `${dislikePct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
