import Link from "next/link";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <>
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.55),transparent_45%),radial-gradient(circle_at_85%_60%,rgba(217,70,239,0.45),transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
            Envíos a todo el Perú 🇵🇪
          </p>
          <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            La tecnología que quieres, al precio que buscas.
          </h1>
          <p className="mt-4 max-w-md text-zinc-300 sm:text-lg">
            Laptops, celulares, audio y accesorios. Elige, agrega al carrito y listo.
          </p>
          <a
            href="#catalogo"
            className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-zinc-900 transition hover:bg-indigo-100"
          >
            Ver catálogo
          </a>
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-8 sm:py-12">
        <Suspense fallback={<CatalogSkeleton />}>
          <Catalog searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function Catalog({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const cat = typeof sp.cat === "string" ? sp.cat : "";
  const [products, categories] = await Promise.all([
    getProducts({ q: q || undefined, category: cat || undefined }),
    getCategories(),
  ]);

  const href = (c: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (c) params.set("cat", c);
    const s = params.toString();
    return `/${s ? `?${s}` : ""}#catalogo`;
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{cat || "Todos los productos"}</h2>
        <form action="/" className="relative w-full sm:w-72">
          {cat && <input type="hidden" name="cat" value={cat} />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar productos…"
            className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-base ring-1 ring-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </form>
      </div>

      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {["", ...categories].map((c) => {
          const active = c === cat;
          return (
            <Link
              key={c || "todos"}
              href={href(c)}
              scroll={false}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                active ? "bg-zinc-900 text-white" : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:ring-zinc-400"
              }`}
            >
              {c || "Todos"}
            </Link>
          );
        })}
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-zinc-200">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 font-semibold">No encontramos productos{q ? ` para “${q}”` : ""}.</p>
          <Link href="/#catalogo" className="mt-4 inline-block text-sm font-semibold text-indigo-600">
            Ver todo el catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/70">
          <div className="aspect-square animate-pulse bg-zinc-200" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
            <div className="h-5 w-24 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
