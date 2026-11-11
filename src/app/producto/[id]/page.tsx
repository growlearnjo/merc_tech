import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct } from "@/lib/products";
import { formatSoles } from "@/lib/money";
import { ProductImage } from "@/components/ProductImage";
import { StockBadge } from "@/components/StockBadge";
import { AddToCart } from "@/components/AddToCart";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function load(id: string) {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? getProduct(n) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = load((await params).id);
  return { title: product?.name ?? "Producto no encontrado" };
}

export default async function ProductPage({ params }: Props) {
  const product = load((await params).id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <nav className="mb-5 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-900">Catálogo</Link>
        <span className="mx-2">/</span>
        <Link href={`/?cat=${encodeURIComponent(product.category)}`} className="hover:text-slate-900">
          {product.category}
        </Link>
      </nav>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          <ProductImage name={product.name} category={product.category} imageUrl={product.imageUrl} />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {product.category}
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold">{formatSoles(product.priceCents)}</span>
            <StockBadge stock={product.stock} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin stock por ahora"}
          </p>

          <p className="mt-6 leading-relaxed text-slate-700">{product.description}</p>

          <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <li className="rounded-xl bg-white p-3 ring-1 ring-slate-200">🚚 Envío en 24–48 h en Lima</li>
            <li className="rounded-xl bg-white p-3 ring-1 ring-slate-200">🛡️ 12 meses de garantía</li>
            <li className="rounded-xl bg-white p-3 ring-1 ring-slate-200">↩️ Cambios hasta 7 días</li>
            <li className="rounded-xl bg-white p-3 ring-1 ring-slate-200">🧾 Boleta o factura</li>
          </ul>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
