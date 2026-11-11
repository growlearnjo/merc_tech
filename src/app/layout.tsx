import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: { default: "VoltTech · Tecnología al mejor precio", template: "%s · VoltTech" },
  description: "Laptops, celulares, audio, monitores y gaming con envío a todo el Perú.",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex min-h-dvh flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="mt-16 border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} VoltTech · Precios en soles (S/) con IGV incluido.</p>
              <div className="flex gap-4">
                <Link href="/" className="hover:text-slate-900">Catálogo</Link>
                <Link href="/pedidos" className="hover:text-slate-900">Mis pedidos</Link>
                <Link href="/admin" className="hover:text-slate-900">Cargar productos</Link>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
