import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl">🤷</p>
      <h1 className="mt-4 text-2xl font-bold">No encontramos esta página</h1>
      <p className="mt-2 text-zinc-500">Puede que el producto o pedido ya no exista.</p>
      <Link href="/" className="mt-6 inline-flex rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white hover:bg-indigo-600">
        Volver a la tienda
      </Link>
    </div>
  );
}
