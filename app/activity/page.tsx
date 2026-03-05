"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDb } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { STORAGE_KEYS } from "@/components/RegistrationForm";

import activityItemsData from "@/data/activityItems.json";

const activityItems = activityItemsData as { id: string; image: string }[];

export default function ActivityPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "like" | "dislike">>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem(STORAGE_KEYS.username);
    const r = localStorage.getItem(STORAGE_KEYS.realName);
    if (!u || !r) {
      router.replace("/play");
      return;
    }
    setUsername(u);
  }, [router]);

  useEffect(() => {
    if (!username) return;

    const db = getDb();
    getDoc(doc(db, "activityAnswers", username)).then((snap) => {
      if (snap.exists()) {
        setSubmitted(true);
      }
    });
  }, [username]);

  const currentItem = activityItems[currentIndex];
  const allAnswered = activityItems.every((item) => item.id in answers);
  const totalItems = activityItems.length;

  function handleLike() {
    if (!currentItem) return;
    setAnswers((prev) => ({ ...prev, [currentItem.id]: "like" }));
    if (currentIndex < totalItems - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleDislike() {
    if (!currentItem) return;
    setAnswers((prev) => ({ ...prev, [currentItem.id]: "dislike" }));
    if (currentIndex < totalItems - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }

  async function handleSubmit() {
    if (!username || !allAnswered || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const db = getDb();
      await setDoc(doc(db, "activityAnswers", username), {
        username,
        answers,
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!username) {
    return null;
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl border border-green-600/50 bg-green-950/30 p-8 text-center">
          <div className="mb-4 text-4xl text-green-400">✓</div>
          <h2 className="text-xl font-semibold text-slate-100">
            تم إرسال إجاباتك بنجاح
          </h2>
          <p className="mt-2 text-slate-400">شكراً لمشاركتك في النشاط</p>
          <a
            href="/play"
            className="mt-6 inline-block rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400"
          >
            العودة للعب
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1222] p-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <p className="mb-4 text-slate-400">
          {currentIndex + 1} / {totalItems}
        </p>

        <div className="relative mb-6 w-full overflow-hidden rounded-xl border border-slate-700/50 bg-[#131c2e]">
          {currentItem && (
            <img
              src={encodeURI(currentItem.image)}
              alt={`Tweet ${currentItem.id}`}
              className="w-full object-contain"
              style={{ maxHeight: "70vh" }}
            />
          )}
        </div>

        <div className="mb-6 flex gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors ${
              answers[currentItem?.id ?? ""] === "like"
                ? "bg-green-600 text-white"
                : "border border-slate-600 text-slate-300 hover:bg-slate-800/50"
            }`}
          >
            <span className="text-2xl">👍</span>
            إعجاب
          </button>
          <button
            onClick={handleDislike}
            className={`flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors ${
              answers[currentItem?.id ?? ""] === "dislike"
                ? "bg-red-600 text-white"
                : "border border-slate-600 text-slate-300 hover:bg-slate-800/50"
            }`}
          >
            <span className="text-2xl">👎</span>
            عدم إعجاب
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          {activityItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 w-8 rounded-full transition-colors ${
                i === currentIndex
                  ? "bg-blue-500"
                  : item.id in answers
                    ? "bg-slate-500"
                    : "bg-slate-700"
              }`}
              title={`${i + 1}`}
            />
          ))}
        </div>

        {allAnswered && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-blue-500 px-8 py-3 font-medium text-white hover:bg-blue-400 disabled:opacity-50"
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال الإجابات"}
          </button>
        )}

        <a
          href="/play"
          className="mt-6 text-sm text-slate-400 hover:text-slate-300"
        >
          العودة للعب
        </a>
      </div>
    </div>
  );
}
