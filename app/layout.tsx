import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrepWise AI - Smart Study Planner",
  description: "Generate personalized day-by-day study plans with AI. Ace your exams with PrepWise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0B0F17]">
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#161B26]">
          <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tight">
              <span className="text-white">PrepWise</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                AI
              </span>
            </Link>
            <div className="flex items-center gap-1 text-sm">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
              >
                Home
              </Link>
              <Link
                href="/plans"
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
              >
                My Plans
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
