import ProjectGrid from "@/components/ProjectGrid";
import { getPostsByType } from "@/lib/posts";

export default function HomePage() {
  const projects = getPostsByType("project");
  const blogPosts = getPostsByType("blog");

  return (
    <div className="space-y-16">
      {projects.length > 0 && <ProjectGrid projects={projects} />}
      {blogPosts.length > 0 && (
        <ProjectGrid
          projects={blogPosts}
          heading="Notes"
          headingLevel="h2"
          hrefPrefix="/notes"
          compact
          showSummaries
        />
      )}
    </div>
  );
}
