import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import IntroCurtain from "@/components/motion/IntroCurtain";
import SmoothScroll from "@/components/motion/SmoothScroll";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Huddle",
  description:
    "Find your people. At your level. When you're all free. Personal agents in iMessage that find, rank and negotiate with each other for you.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        <noscript>
          <style>{`.reveal, .stagger-item { opacity: 1 !important; filter: none !important; transform: none !important; } .intro-curtain { display: none !important; }`}</style>
        </noscript>
        <IntroCurtain />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
