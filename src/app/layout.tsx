import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// PrimeReact styles removed to avoid lightningcss build issues on Vercel
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import RoleChecker from "@/components/RoleChecker";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "True Farming",
  description: "Your platform to optimize farming in Guild Wars 2",
  icons: {
    shortcut: "/images/icons/favicon.svg",
    apple: "/images/icons/icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2746156864243335"
        crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <I18nProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
              <RoleChecker />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
              <ScrollToTop />
              <Analytics />
            </div>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

