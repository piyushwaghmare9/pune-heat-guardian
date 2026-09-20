import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const inter = Inter({ subsets: ["latin"] });

import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/components/ui/toast";
import { NavigationShell } from "@/components/layout/navigation-shell";

export const metadata: Metadata = {
  title: "HeatGuard AI | Urban Heat Intelligence",
  description: "AI-powered urban heat intelligence and climate action platform for smarter, cooler cities in Pune.",
  keywords: ["urban heat", "climate action", "tree plantation", "Pune environmental intelligence", "AI climate", "HeatGuard"],
  authors: [{ name: "HeatGuard AI Team" }],
  openGraph: {
    title: "HeatGuard AI",
    description: "AI-powered urban heat intelligence and climate action platform.",
    url: "https://heatguard.ai",
    siteName: "HeatGuard AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeatGuard AI",
    description: "AI-powered urban heat intelligence and climate action platform.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/20`}>
        <AuthProvider>
          <ToastProvider>
            <NavigationShell>{children}</NavigationShell>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
