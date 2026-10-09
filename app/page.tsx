import ProjectGrid from "@/components/ProjectGrid";
import { getPostsByType } from "@/lib/posts";

export default function HomePage() {
  const projects = getPostsByType("project");

  return projects.length > 0 ? <ProjectGrid projects={projects} /> : null;
}
