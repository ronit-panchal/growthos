import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GrowthOS | Agency Revenue Operating System",
    template: "%s | GrowthOS",
  },
  description: "GrowthOS is a revenue operating system for agencies that combines lead capture, website audits, outreach generation, proposals, and owner analytics in one SaaS workspace.",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
