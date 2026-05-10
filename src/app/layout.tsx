import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrowthOS - AI-Powered Growth Platform",
  description: "AI-powered SaaS platform for agencies and businesses to accelerate growth with intelligent lead capture, audits, outreach, and proposals.",
  keywords: ["GrowthOS", "AI", "SaaS", "growth platform", "lead generation", "audit", "outreach"],
  authors: [{ name: "GrowthOS Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "GrowthOS - AI-Powered Growth Platform",
    description: "Accelerate growth with AI-powered lead capture, audits, outreach, and proposals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
