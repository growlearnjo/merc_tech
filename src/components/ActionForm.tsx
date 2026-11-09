"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions";

/** Formulario genérico que muestra el error o el éxito que devuelve la acción. */
export function ActionForm({
  action,
  children,
  className = "space-y-4",
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className={className}>
      {state?.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {state.ok}
        </p>
      )}
      {children}
    </form>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border-0 bg-white px-4 py-3 text-base text-zinc-900 ring-1 ring-zinc-300 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        {...rest}
      />
    </label>
  );
}
