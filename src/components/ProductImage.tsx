// Si el producto no tiene foto, se muestra una ilustración por categoría:
// así la demo no depende de imágenes externas ni de internet.
const STYLES: Record<string, { emoji: string; bg: string }> = {
  Laptops: { emoji: "💻", bg: "from-indigo-500 via-violet-500 to-fuchsia-500" },
  Celulares: { emoji: "📱", bg: "from-sky-500 via-cyan-500 to-teal-400" },
  Audio: { emoji: "🎧", bg: "from-rose-500 via-pink-500 to-orange-400" },
  Monitores: { emoji: "🖥️", bg: "from-slate-700 via-slate-600 to-indigo-500" },
  Gaming: { emoji: "⌨️", bg: "from-emerald-500 via-lime-500 to-yellow-400" },
  Accesorios: { emoji: "🔌", bg: "from-amber-500 via-orange-500 to-red-500" },
  Tablets: { emoji: "📲", bg: "from-blue-600 via-indigo-500 to-sky-400" },
  Smartwatch: { emoji: "⌚", bg: "from-purple-600 via-fuchsia-500 to-pink-400" },
};
const FALLBACK = { emoji: "📦", bg: "from-zinc-600 via-zinc-500 to-zinc-400" };

export function ProductImage({
  name,
  category,
  imageUrl,
  size = "md",
}: {
  name: string;
  category: string;
  imageUrl: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const emojiSize = { sm: "text-3xl", md: "text-6xl", lg: "text-8xl sm:text-9xl" }[size];

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- URLs arbitrarias cargadas por el admin
      <img src={imageUrl} alt={name} className="h-full w-full object-cover" loading="lazy" />
    );
  }

  const style = STYLES[category] ?? FALLBACK;
  return (
    <div
      role="img"
      aria-label={name}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${style.bg}`}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
      <span className={`${emojiSize} drop-shadow-lg`} aria-hidden>
        {style.emoji}
      </span>
    </div>
  );
}
