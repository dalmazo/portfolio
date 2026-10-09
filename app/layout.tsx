import type { Metadata } from "next";
import { Archivo_Black, Finlandica_Text, Geist_Mono, Noto_Sans } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import PostContent from "@/components/PostContent";
import { getPostBySlug, getPostsByType } from "@/lib/posts";
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [about] = getPostsByType("about");
  const aboutPost = about ? await getPostBySlug(about.slug) : null;

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
        <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_29%]">
          <main className="order-last flex min-w-0 justify-center px-6 py-8 lg:order-first lg:px-8 lg:py-10">
            <div className="w-full max-w-[45rem]">{children}</div>
          </main>
          <aside className="order-first flex flex-col border-b border-black/10 px-6 py-5 dark:border-white/10 lg:order-last lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-l lg:px-8 lg:py-6">
            <div className="text-right">
              <Link href="/" className="site-title text-base font-normal">
                Rafael Dalmazo
              </Link>
              {aboutPost && (
                <div className="sidebar-about mt-3">
                  <PostContent html={aboutPost.contentHtml} />
                </div>
              )}
            </div>
            <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm lg:mt-20 lg:flex-col lg:items-end lg:gap-4">
              <Link href="/projects">Projects</Link>
              <Link href="/blog">Notes</Link>
              <Link href="/contact">Contact</Link>
            </nav>
            <div className="mt-6 self-end lg:mt-auto">
              <ThemeToggle />
            </div>
          </aside>
        </div>
      </body>
    </html>
  );
}
