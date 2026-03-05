"use client";

import type { Question } from "@/types";

interface AnswerConfirmationProps {
  question: Question;
  userAnswer: string;
  onLogout?: () => void;
}

export function AnswerConfirmation({ question, userAnswer, onLogout }: AnswerConfirmationProps) {
  const answerLabel = question.options[userAnswer] ?? userAnswer;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6">
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
