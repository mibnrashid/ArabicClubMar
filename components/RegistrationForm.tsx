"use client";

import { useState } from "react";
import { getDb } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const STORAGE_KEYS = {
  username: "arabic_club_username",
  realName: "arabic_club_realname",
} as const;

interface RegistrationFormProps {
  onRegistered: (username: string, realName: string) => void;
  onBack?: () => void;
}

export function RegistrationForm({ onRegistered, onBack }: RegistrationFormProps) {
  const [realName, setRealName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmedName = realName.trim();
    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedName || !trimmedUsername) {
      setError("يرجى إدخال الاسم واسم المستخدم");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      setError("اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطة سفلية فقط");
      return;
    }

    setIsChecking(true);

    try {
      const db = getDb();
      const userRef = doc(db, "users", trimmedUsername);
      const existing = await getDoc(userRef);

      if (existing.exists()) {
        setError("اسم المستخدم مستخدم بالفعل، يرجى اختيار اسم آخر");
        setIsChecking(false);
        return;
      }

      await setDoc(userRef, {
        username: trimmedUsername,
        realName: trimmedName,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem(STORAGE_KEYS.username, trimmedUsername);
      localStorage.setItem(STORAGE_KEYS.realName, trimmedName);

      onRegistered(trimmedUsername, trimmedName);
    } catch (err) {
      setError("حدث خطأ، يرجى المحاولة مرة أخرى");
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-700/50 bg-[#131c2e] p-8 shadow-xl shadow-black/20">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-100">
          التسجيل
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="realName"
              className="mb-1 block text-sm font-medium text-slate-400"
            >
              الاسم الحقيقي
            </label>
            <input
              id="realName"
              type="text"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              placeholder="أحمد محمد"
              className="w-full rounded-lg border border-slate-600 bg-[#1a2744] px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              dir="rtl"
              autoComplete="name"
              disabled={isChecking}
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-slate-400"
            >
              اسم المستخدم (فريد)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ahmed123"
              className="w-full rounded-lg border border-slate-600 bg-[#1a2744] px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoComplete="username"
              disabled={isChecking}
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={isChecking}
            className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-400 disabled:opacity-50"
          >
            {isChecking ? "جاري التسجيل..." : "تسجيل"}
          </button>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-800/50"
            >
              رجوع
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export { STORAGE_KEYS };
