"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/posts";

const projectImages: Record<string, string> = {
  "project-blooms": "/images/blooms-and-breakfast.png",
  "project-fortnite": "/images/fortnite.jpg",
  "project-looney-tunes": "/images/ltwom.jpg",
  "project-pk-xd": "/images/pk-xd.png",
  "project-wonderbox": "/images/wonderbox.jpg",
};

export default function ProjectGrid({ projects }: { projects: PostMeta[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    startScrollLeft: number;
    isDragging: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const updateScrollButtons = () => {
      setCanScrollLeft(list.scrollLeft > 1);
      setCanScrollRight(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
    };

    updateScrollButtons();
    list.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      list.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [projects.length]);

  const handleMouseDown = (event: ReactMouseEvent<HTMLUListElement>) => {
    if (event.button !== 0) return;

    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: event.currentTarget.scrollLeft,
      isDragging: false,
    };
  };

  const handleMouseMove = (event: ReactMouseEvent<HTMLUListElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState) return;

    if (event.buttons !== 1) {
      dragStateRef.current = null;
      if (listRef.current) listRef.current.style.scrollSnapType = "";
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (!dragState.isDragging && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 4) {
      dragStateRef.current = null;
      return;
    }

    if (!dragState.isDragging && Math.abs(deltaX) > 4) {
      dragState.isDragging = true;
      suppressClickRef.current = true;
      event.currentTarget.style.scrollSnapType = "none";
    }

    if (dragState.isDragging) {
      event.preventDefault();
      event.currentTarget.scrollLeft = dragState.startScrollLeft - deltaX;
    }
  };

  const handleMouseEnd = () => {
    const dragState = dragStateRef.current;
    if (!dragState) return;

    dragStateRef.current = null;
    if (dragState.isDragging) {
      if (listRef.current) listRef.current.style.scrollSnapType = "";
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLUListElement>) => {
    if (!suppressClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  const scrollProjects = (direction: -1 | 1) => {
    const list = listRef.current;
    const firstCard = list?.firstElementChild;
    if (!list || !firstCard) return;

    const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
    const distance = firstCard.getBoundingClientRect().width + gap;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";

    list.scrollBy({ left: direction * distance, behavior });
  };

  return (
    <div>
      <div className="mb-3 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Scroll projects left"
          title="Scroll left"
          disabled={!canScrollLeft}
          onClick={() => scrollProjects(-1)}
          className="flex h-9 w-[3.6rem] items-center justify-center rounded-md border border-black/15 text-lg leading-none transition-colors hover:bg-black/5 disabled:cursor-default disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:border-white/20 dark:hover:bg-white/10"
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        <button
          type="button"
          aria-label="Scroll projects right"
          title="Scroll right"
          disabled={!canScrollRight}
          onClick={() => scrollProjects(1)}
          className="flex h-9 w-[3.6rem] items-center justify-center rounded-md border border-black/15 text-lg leading-none transition-colors hover:bg-black/5 disabled:cursor-default disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:border-white/20 dark:hover:bg-white/10"
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
      <ul
        ref={listRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseEnd}
        onMouseLeave={handleMouseEnd}
        onClickCapture={handleClickCapture}
        className="project-card-list -mt-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-4 pt-4 cursor-grab select-none active:cursor-grabbing lg:relative lg:left-1/2 lg:w-[calc(71vw_-_4rem)] lg:max-w-none lg:-translate-x-1/2"
      >
        {projects.map((project, index) => {
          const imageSrc = projectImages[project.slug];

          return (
            <li key={project.slug} className="aspect-[4/5] h-[min(50svh,97.5vw)] w-[min(40svh,78vw)] min-w-0 flex-none snap-start">
              <Link
                href={`/posts/${project.slug}`}
                draggable={false}
                className="project-card group flex h-full flex-col text-current no-underline transition-transform duration-300 ease-out hover:-translate-y-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
              >
                <span className="project-card-title mb-3 block shrink-0 text-[0.8rem] leading-tight">
                  {project.title}
                </span>
                {imageSrc ? (
                  <span className="project-card-image relative mb-3 min-h-0 flex-1 overflow-hidden rounded-md bg-black/5 dark:bg-white/5">
                    <Image
                      src={imageSrc}
                      alt=""
                      fill
                      draggable={false}
                      loading={index < 2 ? "eager" : "lazy"}
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20"
                    />
                  </span>
                ) : (
                  <span className="mb-3 min-h-0 flex-1 rounded-md bg-black/5 dark:bg-white/5" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}