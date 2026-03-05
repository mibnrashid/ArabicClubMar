"use client";

import type { Question } from "@/types";

interface ActiveQuestionDisplayProps {
  question: Question;
}

export function ActiveQuestionDisplay({ question }: ActiveQuestionDisplayProps) {
  const options = Object.entries(question.options);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
        السؤال الحالي
      </h3>
      <p className="mb-4 text-lg" dir="rtl">
        {question.text}
      </p>
      <div className="space-y-2">
        {options.map(([key, label]) => (
          <div
            key={key}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700"
          >
            <span className="font-medium text-zinc-600 dark:text-zinc-400">
              {key}.
            </span>
            <span dir="rtl">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
