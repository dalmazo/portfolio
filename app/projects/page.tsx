import Link from "next/link";
import { getPostsByType } from "@/lib/posts";

export const metadata = { title: "Projects — Rafael Dalmazo" };

export default function ProjectsPage() {
  const projects = getPostsByType("project");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.slug} className="border-b border-black/10 dark:border-white/10 pb-4">
            <Link href={`/posts/${project.slug}`} className="text-lg font-medium underline">
              {project.title}
            </Link>
            <p className="text-sm opacity-80">{project.summary}</p>
            {project.tags && (
              <p className="text-xs opacity-60 mt-1">{project.tags.join(" · ")}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
