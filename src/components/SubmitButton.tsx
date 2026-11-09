"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText,
  className = "",
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  variant?: "primary" | "ghost";
}) {
  const { pending } = useFormStatus();
  const base =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-indigo-600 disabled:bg-zinc-400"
      : "text-zinc-500 hover:text-red-600 disabled:opacity-50";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition ${base} ${className}`}
    >
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
