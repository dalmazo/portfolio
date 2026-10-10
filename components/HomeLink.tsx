"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeLink() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <nav className="mb-8">
      <Link
        href="/"
        aria-label="Back to home"
        title="Back to home"
        className="inline-flex items-center rounded-md border border-black/15 px-3 py-2 text-sm transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:border-white/20 dark:hover:bg-white/10"
      >
        <span aria-hidden="true" className="text-lg leading-none">←</span>
      </Link>
    </nav>
  );
}
