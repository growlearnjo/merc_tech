import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatSoles } from "@/lib/money";
import { ProductImage } from "./ProductImage";
import { StockBadge } from "./StockBadge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/producto/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden">
        <ProductImage
          name={product.name}
          category={product.category}
          imageUrl={product.imageUrl}
          className="transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
          {product.category}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 sm:text-base">
          {product.name}
        </h3>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-1 pt-2">
          <span className="text-base font-bold text-slate-900 sm:text-lg">
            {formatSoles(product.priceCents)}
          </span>
          <StockBadge stock={product.stock} />
        </div>
      </div>
    </Link>
  );
}
