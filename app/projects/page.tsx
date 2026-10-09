import ProjectGrid from "@/components/ProjectGrid";
import { getPostsByType } from "@/lib/posts";

export const metadata = { title: "Projects — Rafael Dalmazo" };

export default function ProjectsPage() {
  const projects = getPostsByType("project");

  return (
    <div className="space-y-16">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <ProjectGrid projects={projects} />
    </div>
  );
}
