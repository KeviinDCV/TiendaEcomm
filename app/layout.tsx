import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AiAssistant from "./components/AiAssistant";

const inter = Inter({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "HUV - Equipamiento Médico Profesional",
  description: "Plataforma líder en venta de equipos médicos hospitalarios. Calidad certificada y envíos a todo el país.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased bg-[hsl(210,20%,98%)] text-[hsl(210,15%,10%)]`}>
        {children}
        <AiAssistant />
      </body>
    </html>
  );
}