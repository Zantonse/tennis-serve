import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className="font-[family-name:var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}
