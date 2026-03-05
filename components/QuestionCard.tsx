"use client";

import { useState } from "react";
import { getDb } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  username: string;
  questionId: string;
  onAnswered: () => void;
  onLogout?: () => void;
}

export function QuestionCard({
  question,
  username,
  questionId,
  onAnswered,
  onLogout,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const db = getDb();
      await setDoc(doc(db, "answers", username), {
        username,
        answer: selected,
        questionId,
        submittedAt: new Date().toISOString(),
      });
      onAnswered();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  }

  const options = Object.entries(question.options);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-xl border border-slate-700/50 bg-[#131c2e] p-8 shadow-xl shadow-black/20">
        <h2 className="mb-6 text-center text-xl font-semibold text-slate-100" dir="rtl">
          {question.text}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {options.map(([key, label]) => (
            <label
              key={key}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                selected === key
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-slate-600 hover:border-slate-500 bg-[#1a2744]"
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={key}
                checked={selected === key}
                onChange={() => setSelected(key)}
                className="h-4 w-4"
                disabled={isSubmitting}
              />
              <span className="font-medium text-slate-100" dir="rtl">
                {key}. {label}
              </span>
            </label>
          ))}
          <button
            type="submit"
            disabled={!selected || isSubmitting}
            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-400 disabled:opacity-50"
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال الإجابة"}
          </button>
        </form>
      </div>
      {onLogout && (
        <button
          onClick={onLogout}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-slate-300"
        >
          تسجيل الخروج
        </button>
      )}
    </div>
  );
}
