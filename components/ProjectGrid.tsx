"use client";

import { useState } from "react";
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
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <ul className="grid grid-cols-1 gap-3">
      {projects.map((project, index) => {
        const imageSrc = projectImages[project.slug];
        const hasImage = Boolean(imageSrc);
        const showImage = hasImage && expandedIndex === index;

        return (
          <li key={project.slug} className="project-card-item min-w-0">
            <Link
              href={`/posts/${project.slug}`}
              onMouseEnter={() => setExpandedIndex(index)}
              onFocus={() => setExpandedIndex(index)}
              className={`project-card relative z-0 flex flex-col justify-end overflow-hidden rounded border border-black/10 bg-black/[0.03] p-5 no-underline hover:z-10 hover:bg-black/[0.06] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] ${expandedIndex === index ? "is-expanded" : ""}`}
            >
              {imageSrc && (
                <>
                  <Image
                    src={imageSrc}
                    alt=""
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(min-width: 1024px) 720px, calc(100vw - 3rem)"
                    className="project-card-image-layer pointer-events-none object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="project-card-image-layer pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
                  />
                </>
              )}
              <span className={`project-card-title relative z-10 text-lg font-semibold ${showImage ? "project-card-title-image text-white" : ""}`}>
                {project.title}
              </span>
              <span className={`relative z-10 mt-1 text-sm leading-relaxed opacity-75 ${showImage ? "text-white/90" : ""}`}>
                {project.summary}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}