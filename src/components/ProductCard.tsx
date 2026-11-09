import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatPEN } from "@/lib/money";
import { ProductImage } from "./ProductImage";
import { StockBadge } from "./StockBadge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/70 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden">
        <div className="h-full w-full transition duration-300 group-hover:scale-105">
          <ProductImage name={product.name} category={product.category} imageUrl={product.image_url} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
          {product.category}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 sm:text-base">
          {product.name}
        </h3>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-1 pt-2">
          <span className="text-base font-bold text-zinc-900 sm:text-lg">{formatPEN(product.price_cents)}</span>
          <StockBadge stock={product.stock} />
        </div>
      </div>
    </Link>
  );
}
