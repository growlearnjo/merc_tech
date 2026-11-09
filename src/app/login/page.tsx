import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/AuthCard";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-zinc-200" />}>
        <WithNext searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function WithNext({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const { next } = await searchParams;
  return <AuthCard mode="login" next={next} />;
}
