import type { Metadata } from "next";
import { Archivo_Black, Finlandica_Text, Geist_Mono, Noto_Sans } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const finlandicaText = Finlandica_Text({
  variable: "--font-finlandica-text",
  subsets: ["latin"],
  weight: "600",
});

export const metadata: Metadata = {
  title: "Rafael Dalmazo - Portfolio",
  description: "Technical Artist portfolio - projects, notes and contact.",
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
      className={`${notoSans.variable} ${archivoBlack.variable} ${finlandicaText.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full">
        <div className="min-h-screen">
          <header className="border-b border-black/10 dark:border-white/10">
            <div className="mx-auto flex w-full max-w-[88rem] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-4 lg:px-8">
              <Link href="/" className="site-title text-base font-normal">
                Rafael Dalmazo
              </Link>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <nav aria-label="Main navigation" className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
                  <Link href="/projects">Projects</Link>
                  <Link href="/blog">Notes</Link>
                  <Link href="/contact">Contact</Link>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex min-w-0 justify-center px-6 py-8 lg:px-8 lg:py-10">
            <div className="w-full max-w-[45rem]">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
