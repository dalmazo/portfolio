"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";
import { getTheme, subscribeTheme } from "@/lib/theme";

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

export default function PostContent({
  html,
  collapsible = [],
}: {
  html: string;
  collapsible?: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const collapsibleKey = collapsible.join("|");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const collapsibleTitles = new Set(collapsibleKey ? collapsibleKey.split("|") : []);
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

    let unsubscribeTheme: (() => void) | undefined;
    let cancelled = false;
    const mermaidBlocks = Array.from(
      container.querySelectorAll<HTMLElement>("code.language-mermaid")
    );
    // Keep each definition on its wrapper so diagrams can be redrawn when the theme changes.
    mermaidBlocks.forEach((block) => {
      const wrapper = document.createElement("div");
      wrapper.className = "mermaid-diagram";
      wrapper.dataset.definition = block.textContent ?? "";
      block.closest("pre")?.replaceWith(wrapper);
    });
    // Also picks up wrappers from an earlier run of this effect (React dev mode runs it twice).
    const wrappers = Array.from(
      container.querySelectorAll<HTMLElement>(".mermaid-diagram[data-definition]")
    );
    if (wrappers.length > 0) {
      import("mermaid").then(({ default: mermaid }) => {
        if (cancelled) return;
        const renderAll = () => {
          mermaid.initialize({
            startOnLoad: false,
            theme: getTheme() === "dark" ? "dark" : "default",
          });
          wrappers.forEach((wrapper, index) => {
            const id = `mermaid-diagram-${index}-${Math.random().toString(36).slice(2)}`;
            mermaid
              .render(id, wrapper.dataset.definition ?? "")
              .then(({ svg }) => {
                wrapper.innerHTML = svg;
              })
              .catch((err) => {
                console.error("Failed to render mermaid diagram", err);
              });
          });
        };
        renderAll();
        unsubscribeTheme = subscribeTheme(renderAll);
      });
    }

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
      // First line: the video path. Optional "poster: /path.jpg" line: the still shown before play.
      const [src = "", ...rest] = (block.textContent ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      if (!src) return;
      const poster = rest.find((line) => line.startsWith("poster:"))?.slice(7).trim();
      const wrapper = document.createElement("div");
      wrapper.className = "video-embed";
      const video = document.createElement("video");
      video.src = src;
      if (poster) video.poster = asset(poster);
      video.preload = "metadata";
      video.controls = true;
      video.playsInline = true;
      wrapper.appendChild(video);
      block.closest("pre")?.replaceWith(wrapper);
    });

    return () => {
      cancelled = true;
      unsubscribeTheme?.();
    };
  }, [html, collapsibleKey]);

  return (
    <div
      ref={containerRef}
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
