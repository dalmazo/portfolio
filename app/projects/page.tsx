import ProjectGrid from "@/components/ProjectGrid";
import { getPostsByType } from "@/lib/posts";

export const metadata = { title: "Projects — Rafael Dalmazo" };

export default function ProjectsPage() {
  const projects = getPostsByType("project");

  return <ProjectGrid projects={projects} />;
}
