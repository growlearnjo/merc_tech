// Imagen del producto: usa la URL si existe; si no, una ilustración por categoría
// (todo local, funciona sin internet durante la demo).

const STYLES: Record<string, { bg: string; icon: React.ReactNode }> = {
  Laptops: {
    bg: "from-indigo-500 via-violet-500 to-purple-600",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="11" rx="1.5" />
        <path d="M2 19h20l-2-4H4z" />
      </>
    ),
  },
  Celulares: {
    bg: "from-sky-500 via-cyan-500 to-teal-500",
    icon: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2.5" />
        <path d="M11 18h2" />
      </>
    ),
  },
  Audio: {
    bg: "from-rose-500 via-pink-500 to-fuchsia-600",
    icon: (
      <>
        <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
        <rect x="3" y="14" width="4" height="7" rx="1.5" />
        <rect x="17" y="14" width="4" height="7" rx="1.5" />
      </>
    ),
  },
  Monitores: {
    bg: "from-emerald-500 via-teal-500 to-cyan-600",
    icon: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  Gaming: {
    bg: "from-orange-500 via-amber-500 to-yellow-500",
    icon: (
      <>
        <rect x="2" y="7" width="20" height="11" rx="5.5" />
        <path d="M6.5 12.5h4M8.5 10.5v4" />
        <circle cx="15.5" cy="13.5" r="0.8" />
        <circle cx="17.5" cy="11.5" r="0.8" />
      </>
    ),
  },
  Accesorios: {
    bg: "from-slate-600 via-slate-700 to-slate-900",
    icon: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  },
};

const FALLBACK = {
  bg: "from-blue-500 via-indigo-500 to-violet-600",
  icon: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
};

export function ProductImage({
  name,
  category,
  imageUrl,
  className = "",
}: {
  name: string;
  category: string;
  imageUrl: string | null;
  className?: string;
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        className={`h-full w-full bg-white object-contain ${className}`}
      />
    );
  }
  const style = STYLES[category] ?? FALLBACK;
  return (
    <div
      role="img"
      aria-label={name}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${style.bg} ${className}`}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-black/10 blur-2xl" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative h-2/5 w-2/5 text-white drop-shadow-lg"
        aria-hidden
      >
        {style.icon}
      </svg>
    </div>
  );
}
