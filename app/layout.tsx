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
    default: "The Science of The Tennis Serve",
    template: "%s | Tennis Serve Guide",
  },
  description:
    "Biomechanics, training, strategy, and recovery — a comprehensive guide built from peer-reviewed research and elite coaching analysis.",
  openGraph: {
    title: "The Science of The Tennis Serve",
    description:
      "Comprehensive tennis serve guide with biomechanics, training drills, and strategy.",
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
