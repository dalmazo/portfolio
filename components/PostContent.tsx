"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

function parseYouTubeInput(input: string): { id: string; start?: number } | null {
  const trimmed = input.trim();
  const match = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/
  );
  const id = match ? match[1] : /^[\w-]{11}$/.test(trimmed) ? trimmed : null;
  if (!id) return null;

  // Supports ?t=90, ?t=90s and ?start=90 style timestamps.
  const timeMatch = trimmed.match(/[?&](?:t|start)=(\d+)/);
  const start = timeMatch ? parseInt(timeMatch[1], 10) : undefined;
  return { id, start };
}

export default function PostContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const collapsibleTitles = new Set([
      "Old manual LiveOps pipeline",
      "New automated LiveOps pipeline",
    ]);
    const sectionHeadings = Array.from(container.querySelectorAll("h3"));
    sectionHeadings.forEach((heading) => {
      const title = heading.textContent?.trim() ?? "";
      if (!collapsibleTitles.has(title)) return;

      const details = document.createElement("details");
      details.className = "content-disclosure";
      const summary = document.createElement("summary");
      summary.textContent = title;
      details.appendChild(summary);

      let sibling = heading.nextSibling;
      while (
        sibling &&
        !(sibling instanceof HTMLElement && /^H[1-6]$/.test(sibling.tagName))
      ) {
        const nextSibling = sibling.nextSibling;
        details.appendChild(sibling);
        sibling = nextSibling;
      }

      heading.replaceWith(details);
    });

    const isDark = document.documentElement.classList.contains("dark");
    mermaid.initialize({ startOnLoad: false, theme: isDark ? "dark" : "default" });

    const mermaidBlocks = Array.from(
      container.querySelectorAll<HTMLElement>("code.language-mermaid")
    );
    mermaidBlocks.forEach((block, index) => {
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

    const youtubeBlocks = Array.from(
      container.querySelectorAll<HTMLElement>("code.language-youtube")
    );
    youtubeBlocks.forEach((block) => {
      const parsed = parseYouTubeInput(block.textContent ?? "");
      if (!parsed) {
        console.error("Could not extract a YouTube video ID from:", block.textContent);
        return;
      }
      const wrapper = document.createElement("div");
      wrapper.className = "youtube-embed";
      const iframe = document.createElement("iframe");
      const startParam = parsed.start ? `?start=${parsed.start}` : "";
      iframe.src = `https://www.youtube-nocookie.com/embed/${parsed.id}${startParam}`;
      iframe.title = "YouTube video player";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      wrapper.appendChild(iframe);
      block.closest("pre")?.replaceWith(wrapper);
    });

    const videoBlocks = Array.from(
      container.querySelectorAll<HTMLElement>("code.language-video")
    );
    videoBlocks.forEach((block) => {
      const src = (block.textContent ?? "").trim();
      if (!src) return;
      const wrapper = document.createElement("div");
      wrapper.className = "video-embed";
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      wrapper.appendChild(video);
      block.closest("pre")?.replaceWith(wrapper);
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
