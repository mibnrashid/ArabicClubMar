"use client";

export function WaitingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600" />
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          في انتظار السؤال التالي...
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          سيظهر السؤال تلقائياً عند بدء الجولة
        </p>
        <a
          href="/admin"
          className="mt-6 inline-block text-sm text-blue-600 hover:underline"
        >
          لوحة التحكم
        </a>
      </div>
    </div>
  );
}
