import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "The Complete Tennis Guide — 4.0 to 4.5",
    template: "%s | Tennis Guide",
  },
  description:
    "A research-backed guide to reaching 4.5 NTRP — technique, biomechanics, strategy, conditioning, mental game, and recovery.",
  openGraph: {
    title: "The Complete Tennis Guide — 4.0 to 4.5",
    description:
      "25 chapters of research-backed tennis development covering technique, strategy, fitness, and the mental game.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="font-[family-name:var(--font-inter)] antialiased">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
