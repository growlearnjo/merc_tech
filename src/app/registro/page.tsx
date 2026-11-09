import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/AuthCard";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage({ searchParams }: PageProps<"/registro">) {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <Suspense fallback={<div className="h-[28rem] animate-pulse rounded-3xl bg-zinc-200" />}>
        <WithNext searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function WithNext({ searchParams }: { searchParams: PageProps<"/registro">["searchParams"] }) {
  const { next } = await searchParams;
  return <AuthCard mode="registro" next={next} />;
}
