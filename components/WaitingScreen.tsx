"use client";

export function WaitingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
        <h2 className="text-xl font-semibold text-slate-100">
          في انتظار السؤال التالي...
        </h2>
        <p className="mt-2 text-slate-400">
          سيظهر السؤال تلقائياً عند بدء الجولة
        </p>
      </div>
    </div>
  );
}
