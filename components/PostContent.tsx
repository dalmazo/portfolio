"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function PostContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isDark = document.documentElement.classList.contains("dark");
    mermaid.initialize({ startOnLoad: false, theme: isDark ? "dark" : "default" });

    const blocks = Array.from(container.querySelectorAll<HTMLElement>("code.language-mermaid"));
    blocks.forEach((block, index) => {
      const definition = block.textContent ?? "";
      const id = `mermaid-diagram-${index}-${Math.random().toString(36).slice(2)}`;
      mermaid
        .render(id, definition)
        .then(({ svg }) => {
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-diagram";
          wrapper.innerHTML = svg;
          block.closest("pre")?.replaceWith(wrapper);
        })
        .catch((err) => {
          console.error("Failed to render mermaid diagram", err);
        });
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
