"use client";

import type { Question } from "@/types";

interface ActiveQuestionDisplayProps {
  question: Question;
  showCorrectAnswer?: boolean;
}

export function ActiveQuestionDisplay({ question, showCorrectAnswer }: ActiveQuestionDisplayProps) {
  const options = Object.entries(question.options);

  return (
    <div className="rounded-lg border border-slate-700/50 bg-[#131c2e] p-6">
      <h3 className="mb-4 font-semibold text-slate-100">
        {showCorrectAnswer ? "السؤال" : "السؤال الحالي"}
      </h3>
      <p className="mb-4 text-lg text-slate-200" dir="rtl">
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
                  ? "border-green-500 bg-green-950/40"
                  : "border-slate-600 bg-[#1a2744]"
              }`}
            >
              <span className={`font-medium ${isCorrect ? "text-green-400" : "text-slate-400"}`}>
                {key}.
              </span>
              <span dir="rtl" className={isCorrect ? "text-green-400 font-medium" : "text-slate-200"}>
                {label}
              </span>
              {isCorrect && (
                <span className="mr-auto text-sm text-green-500">
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
