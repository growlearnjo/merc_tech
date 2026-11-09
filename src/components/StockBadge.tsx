export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">Agotado</span>;
  }
  if (stock <= 5) {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        ¡Quedan {stock}!
      </span>
    );
  }
  return <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">En stock</span>;
}
