"use client";

interface WaitingScreenProps {
  onLogout?: () => void;
}

export function WaitingScreen({ onLogout }: WaitingScreenProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
        <h2 className="text-xl font-semibold text-slate-100">
          في انتظار السؤال التالي...
        </h2>
        <p className="mt-2 text-slate-400">
          سيظهر السؤال تلقائياً عند بدء الجولة
        </p>
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
