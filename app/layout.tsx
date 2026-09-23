import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rafael Dalmazo - Portfolio",
  description: "Technical Artist portfolio - projects, blog and contact.",
};

// Applied before hydration so the theme is correct on first paint.
const themeInitScript = `
(function () {
  var stored = localStorage.getItem("theme");
  var isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", isDark);
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <header className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-6 py-4">
          <Link href="/" className="font-semibold">
            Rafael Dalmazo
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/projects">Projects</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
            <ThemeToggle />
          </nav>
        </header>
        <main className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">{children}</main>
      </body>
    </html>
  );
}
