import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl font-extrabold text-indigo-600">404</p>
      <h1 className="mt-3 text-xl font-bold">No encontramos esta página</h1>
      <p className="mt-2 text-slate-600">Puede que el producto ya no exista o que el enlace esté mal.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">
        Volver al catálogo
      </Link>
    </div>
  );
}
