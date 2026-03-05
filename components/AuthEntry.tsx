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
      <div className="w-full max-w-md rounded-xl border border-slate-700/50 bg-[#131c2e] p-8 shadow-xl shadow-black/20">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-100">
          مرحباً
        </h1>
        <p className="mb-6 text-center text-slate-400">
          اختر طريقة الدخول
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setMode("login")}
            className="rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-400"
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => setMode("signup")}
            className="rounded-lg border border-slate-600 px-4 py-3 font-medium text-slate-300 transition-colors hover:bg-slate-800/50"
          >
            إنشاء حساب جديد
          </button>
        </div>
      </div>
    </div>
  );
}
