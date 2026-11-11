"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction } from "@/app/actions";
import { Alert, Field, SubmitButton } from "./ui";
import { useKeepValuesSubmit } from "./useKeepValuesSubmit";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const isLogin = mode === "login";
  const [state, formAction, pending] = useActionState(isLogin ? loginAction : registerAction, undefined);
  const onSubmit = useKeepValuesSubmit(formAction);
  const nextQs = next !== "/" ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isLogin ? "Ingresa para terminar tus compras y ver tus pedidos." : "Solo toma un minuto."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          {!isLogin && <Field label="Nombre" name="name" required autoComplete="name" placeholder="Ana Torres" />}
          <Field label="Correo electrónico" name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" />
          <Field
            label="Contraseña"
            name="password"
            type="password"
            required
            minLength={isLogin ? undefined : 8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            hint={isLogin ? undefined : "Mínimo 8 caracteres."}
          />
          {state?.error && <Alert kind="error">{state.error}</Alert>}
          <SubmitButton pending={pending}>{isLogin ? "Ingresar" : "Crear cuenta"}</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <Link
            href={`${isLogin ? "/registro" : "/login"}${nextQs}`}
            className="font-semibold text-indigo-600 hover:underline"
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </Link>
        </p>
      </div>
    </div>
  );
}
