"use client";

import type { Question } from "@/types";

interface AnswerConfirmationProps {
  question: Question;
  userAnswer: string;
}

export function AnswerConfirmation({ question, userAnswer }: AnswerConfirmationProps) {
  const answerLabel = question.options[userAnswer] ?? userAnswer;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-green-200 bg-green-50 p-8 dark:border-green-900 dark:bg-green-950/30">
        <div className="text-center">
          <div className="mb-4 text-4xl">✓</div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            تم إرسال إجابتك بنجاح
          </h2>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300" dir="rtl">
            إجابتك: <strong>{answerLabel}</strong>
          </p>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            في انتظار السؤال التالي...
          </p>
        </div>
      </div>
    </div>
  );
}
