import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProduct } from "@/lib/data";
import { formatPEN } from "@/lib/money";
import { ProductImage } from "@/components/ProductImage";
import { StockBadge } from "@/components/StockBadge";
import { AddToCartForm } from "@/components/AddToCartForm";

export default function ProductPage({ params }: PageProps<"/productos/[id]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <Link href="/#catalogo" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900">
        ← Volver al catálogo
      </Link>
      <Suspense fallback={<div className="aspect-square max-w-lg animate-pulse rounded-3xl bg-zinc-200" />}>
        <ProductDetail params={params} />
      </Suspense>
    </div>
  );
}

async function ProductDetail({ params }: { params: PageProps<"/productos/[id]">["params"] }) {
  const { id } = await params;
  const product = await getProduct(Number(id));
  if (!product) notFound();

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-10">
      <div className="aspect-square overflow-hidden rounded-3xl shadow-sm ring-1 ring-zinc-200">
        <ProductImage name={product.name} category={product.category} imageUrl={product.image_url} size="lg" />
      </div>

      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{product.category}</span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-3xl font-bold">{formatPEN(product.price_cents)}</span>
          <StockBadge stock={product.stock} />
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          {product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin unidades por ahora"}
        </p>

        {product.description && <p className="mt-6 leading-relaxed text-zinc-700">{product.description}</p>}

        <div className="mt-8">
          <AddToCartForm productId={product.id} stock={product.stock} />
        </div>

        <ul className="mt-8 grid gap-3 text-sm text-zinc-600 sm:grid-cols-3">
          <li className="rounded-xl bg-white p-3 ring-1 ring-zinc-200">🚚 Envío a todo el Perú</li>
          <li className="rounded-xl bg-white p-3 ring-1 ring-zinc-200">🛡️ 12 meses de garantía</li>
          <li className="rounded-xl bg-white p-3 ring-1 ring-zinc-200">↩️ Cambios en 7 días</li>
        </ul>
      </div>
    </div>
  );
}
