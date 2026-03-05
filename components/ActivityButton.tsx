"use client";

import Link from "next/link";

export function ActivityButton() {
  return (
    <Link
      href="/activity"
      className="fixed right-6 top-6 z-50 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white shadow-lg transition-colors hover:bg-blue-400"
    >
      النشاط
    </Link>
  );
}
