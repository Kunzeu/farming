import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GW2 Farming Hub - Información y Guías de Guild Wars 2",
  description: "Tu centro de información para farming, precios del Trading Post, guías y todo lo relacionado con Guild Wars 2",
  keywords: "Guild Wars 2, GW2, farming, trading post, precios, guías, builds",
  authors: [{ name: "GW2 Farming Hub" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
