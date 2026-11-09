import Link from "next/link";
import { login, register } from "@/app/actions";
import { safeNext } from "@/lib/auth";
import { ActionForm, Field } from "./ActionForm";
import { SubmitButton } from "./SubmitButton";

export function AuthCard({ mode, next }: { mode: "login" | "registro"; next?: string | string[] }) {
  const target = safeNext(typeof next === "string" ? next : "/");
  const isLogin = mode === "login";
  const otherHref = `${isLogin ? "/registro" : "/login"}${target !== "/" ? `?next=${encodeURIComponent(target)}` : ""}`;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">{isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {isLogin ? "Ingresa para finalizar tus compras." : "Solo te tomará un minuto."}
      </p>

      <ActionForm action={isLogin ? login : register} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={target} />
        {!isLogin && <Field label="Nombre" name="name" required autoComplete="name" placeholder="Ana Torres" />}
        <Field label="Correo" name="email" type="email" required autoComplete="email" placeholder="ana@correo.com" />
        <Field
          label="Contraseña"
          name="password"
          type="password"
          required
          minLength={isLogin ? undefined : 8}
          autoComplete={isLogin ? "current-password" : "new-password"}
          placeholder={isLogin ? "••••••••" : "Mínimo 8 caracteres"}
        />
        <SubmitButton pendingText="Un momento…" className="h-12 w-full">
          {isLogin ? "Ingresar" : "Crear cuenta"}
        </SubmitButton>
      </ActionForm>

      <p className="mt-6 text-center text-sm text-zinc-500">
        {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
        <Link href={otherHref} className="font-semibold text-indigo-600">
          {isLogin ? "Regístrate" : "Inicia sesión"}
        </Link>
      </p>
    </div>
  );
}
