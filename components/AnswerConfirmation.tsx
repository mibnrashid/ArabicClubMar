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
      <div className="w-full max-w-md rounded-xl border border-green-600/50 bg-green-950/30 p-8">
        <div className="text-center">
          <div className="mb-4 text-4xl text-green-400">✓</div>
          <h2 className="text-xl font-semibold text-slate-100">
            تم إرسال إجابتك بنجاح
          </h2>
          <p className="mt-2 text-slate-300" dir="rtl">
            إجابتك: <strong className="text-green-400">{answerLabel}</strong>
          </p>
          <p className="mt-4 text-sm text-slate-400">
            في انتظار السؤال التالي...
          </p>
        </div>
      </div>
    </div>
  );
}
