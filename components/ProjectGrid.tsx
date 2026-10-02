import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function ProjectGrid({ projects }: { projects: PostMeta[] }) {
  return (
    <ul className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {projects.map((project) => (
        <li key={project.slug} className="min-w-0">
          <Link
            href={`/posts/${project.slug}`}
            className="flex aspect-video flex-col justify-end overflow-hidden border border-black/10 bg-black/[0.03] p-5 no-underline transition-colors hover:bg-black/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
          >
            <span className="text-lg font-semibold">{project.title}</span>
            <span className="mt-1 text-sm leading-relaxed opacity-75">
              {project.summary}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}