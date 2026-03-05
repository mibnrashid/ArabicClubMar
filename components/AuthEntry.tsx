"use client";

import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { RegistrationForm } from "@/components/RegistrationForm";

type AuthMode = "choice" | "login" | "signup";

interface AuthEntryProps {
  onAuthenticated: (username: string, realName: string) => void;
}

export function AuthEntry({ onAuthenticated }: AuthEntryProps) {
  const [mode, setMode] = useState<AuthMode>("choice");

  if (mode === "login") {
    return (
      <LoginForm
        onLoggedIn={onAuthenticated}
        onBack={() => setMode("choice")}
      />
    );
  }

  if (mode === "signup") {
    return (
      <RegistrationForm
        onRegistered={onAuthenticated}
        onBack={() => setMode("choice")}
      />
    );
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-6 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          مرحباً
        </h1>
        <p className="mb-6 text-center text-zinc-600 dark:text-zinc-400">
          اختر طريقة الدخول
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setMode("login")}
            className="rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => setMode("signup")}
            className="rounded-lg border border-zinc-300 px-4 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            إنشاء حساب جديد
          </button>
        </div>
      </div>
    </div>
  );
}
