import ProjectGrid from "@/components/ProjectGrid";
import { getPostsByType } from "@/lib/posts";

export default function HomePage() {
  const projects = getPostsByType("project");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Projects</h1>
      {projects.length > 0 && <ProjectGrid projects={projects} />}
    </div>
  );
}
