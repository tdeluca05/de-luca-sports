import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";

export const metadata: Metadata = {
  title: "De Luca Sport — Villa Bosch",
  description:
    "Zapatillas y artículos deportivos con atención personalizada y stock real en Villa Bosch. Reebook, Olympikus, Topper y Atomik.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <div className="site-shell">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
