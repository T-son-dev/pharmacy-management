import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FarmaControl - Sistema de Gestion de Farmacias",
  description: "Sistema completo para gestion de inventario, ventas y control de farmacias con inteligencia artificial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
