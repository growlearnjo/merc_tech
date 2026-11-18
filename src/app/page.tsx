import Link from "next/link";
import { listCategories, listProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; page?: string }>;
}) {
  const { q = "", cat = "", page = "" } = await searchParams;
  const query = q.trim().slice(0, 80);
  const products = listProducts({ q: query || undefined, category: cat || undefined });
  const categories = listCategories();

  // Página pedida en la URL, acotada al rango válido. Un valor inválido cae en la 1.
  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));
  const requested = Number.parseInt(page, 10);
  const currentPage = Number.isNaN(requested) ? 1 : Math.min(Math.max(requested, 1), totalPages);
  const pageProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Enlace al catálogo con los filtros vigentes. La página solo va en la URL si no es la 1,
  // así que recargar la dirección vuelve a la misma página.
  const catalogHref = (opts: { cat?: string; page?: number }) => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (opts.cat) p.set("cat", opts.cat);
    if (opts.page && opts.page > 1) p.set("page", String(opts.page));
    const s = p.toString();
    return s ? `/?${s}` : "/";
  };

  const pageBase =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition";
  const pageLinkCls = `${pageBase} border-slate-200 bg-white text-slate-700 hover:border-slate-400`;
  const pageOffCls = `${pageBase} border-slate-200 bg-white text-slate-300`;
  const pageOnCls = `${pageBase} border-slate-900 bg-slate-900 text-white`;

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-600/40 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-fuchsia-600/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="mb-3 inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-200">
            Envío gratis en Lima desde S/ 199
          </p>
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            La tecnología que necesitas,{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
              al precio justo.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-slate-300">
            Laptops, celulares, audio, monitores y gaming. Compra en minutos desde tu celular.
          </p>

          <form action="/" className="mt-8 flex max-w-xl gap-2">
            {cat && <input type="hidden" name="cat" value={cat} />}
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Buscar productos…"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white/15"
            />
            <button className="rounded-xl bg-indigo-500 px-5 font-semibold transition hover:bg-indigo-400">
              Buscar
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {["", ...categories].map((c) => {
            const active = c === cat;
            return (
              <Link
                key={c || "todos"}
                href={catalogHref({ cat: c })}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                {c || "Todos"}
              </Link>
            );
          })}
        </div>

        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">
            {cat || "Todos los productos"}
            {query && <span className="font-normal text-slate-500"> · “{query}”</span>}
          </h2>
          <span className="text-sm text-slate-500">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium">No encontramos productos con ese criterio.</p>
            <Link href="/" className="mt-2 inline-block text-sm font-semibold text-indigo-600 hover:underline">
              Ver todo el catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {pageProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Páginas del catálogo"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            {currentPage > 1 ? (
              <Link href={catalogHref({ cat, page: currentPage - 1 })} className={pageLinkCls}>
                Anterior
              </Link>
            ) : (
              <span aria-disabled="true" className={pageOffCls}>
                Anterior
              </span>
            )}
            {pages.map((n) =>
              n === currentPage ? (
                <span key={n} aria-current="page" className={pageOnCls}>
                  {n}
                </span>
              ) : (
                <Link key={n} href={catalogHref({ cat, page: n })} className={pageLinkCls}>
                  {n}
                </Link>
              )
            )}
            {currentPage < totalPages ? (
              <Link href={catalogHref({ cat, page: currentPage + 1 })} className={pageLinkCls}>
                Siguiente
              </Link>
            ) : (
              <span aria-disabled="true" className={pageOffCls}>
                Siguiente
              </span>
            )}
          </nav>
        )}
      </section>
    </>
  );
}
