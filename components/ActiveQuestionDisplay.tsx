"use client";

import type { Question } from "@/types";

interface ActiveQuestionDisplayProps {
  question: Question;
  showCorrectAnswer?: boolean;
}

export function ActiveQuestionDisplay({ question, showCorrectAnswer }: ActiveQuestionDisplayProps) {
  const options = Object.entries(question.options);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
        {showCorrectAnswer ? "السؤال" : "السؤال الحالي"}
      </h3>
      <p className="mb-4 text-lg" dir="rtl">
        {question.text}
      </p>
      <div className="space-y-2">
        {options.map(([key, label]) => {
          const isCorrect = showCorrectAnswer && key === question.correctAnswer;
          return (
            <div
              key={key}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                isCorrect
                  ? "border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950/30"
                  : "border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <span className={`font-medium ${isCorrect ? "text-green-700 dark:text-green-400" : "text-zinc-600 dark:text-zinc-400"}`}>
                {key}.
              </span>
              <span dir="rtl" className={isCorrect ? "text-green-700 dark:text-green-400 font-medium" : ""}>
                {label}
              </span>
              {isCorrect && (
                <span className="mr-auto text-sm text-green-600 dark:text-green-500">
                  ✓ الإجابة الصحيحة
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
