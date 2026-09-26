import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";

import "./globals.css";
import { FitLogProvider } from "@/components/fitlog-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitLog — Workout Library. Train Hard, Log Honest.",
  description:
    "FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and watch the week's work add up.",
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
      className={cn("dark", inter.variable, oswald.variable)}
    >
      <body className="page-shell">
        <FitLogProvider>
          <Navbar />
          <main className="site-main">{children}</main>
          <Footer />
          <Toaster
            theme="dark"
            position="bottom-right"
            richColors
            toastOptions={{
              className: "font-sans border border-border bg-card text-foreground",
            }}
          />
        </FitLogProvider>
      </body>
    </html>
  );
}
