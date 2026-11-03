// GitHub Pages serves the site under /portfolio. next.config.ts exposes that prefix
// at build time; plain string paths (next/image with unoptimized, <video>, <a>) need it.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return path.startsWith("/") && !path.startsWith("//") ? `${basePath}${path}` : path;
}

export function isVideo(path: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(path);
}
