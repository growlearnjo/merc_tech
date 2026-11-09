import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "MercadoTech — Tecnología al mejor precio", template: "%s · MercadoTech" },
  description: "Laptops, celulares, audio y accesorios con precios en soles.",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500">
          © 2026 MercadoTech · Precios en soles (PEN) · Tienda de demostración
        </footer>
      </body>
    </html>
  );
}
