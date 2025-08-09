import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// PrimeReact styles removed to avoid lightningcss build issues on Vercel
import { AuthProvider } from "@/contexts/AuthContext";
import RoleChecker from "@/components/RoleChecker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "True Farming",
  description: "Your platform to optimize farming in Guild Wars 2",
  icons: {
    icon: [
      { url: "/images/icons/icon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
      { url: "/images/icons/favicon.ico" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            <RoleChecker />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
