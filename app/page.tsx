import ContactCard from "@/components/ContactCard";
import ProjectGrid from "@/components/ProjectGrid";
import { getPostsByType } from "@/lib/posts";

export default function HomePage() {
  const projects = getPostsByType("project");
  const blogPosts = getPostsByType("blog");

  return (
    <div className="space-y-16">
      <ContactCard />
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
      <footer className="grid grid-cols-1 gap-8 border-t border-black/10 pt-6 dark:border-white/10 sm:grid-cols-2 lg:relative lg:left-1/2 lg:w-[calc(100vw_-_4rem)] lg:max-w-none lg:-translate-x-1/2">
        <section>
          <h2 className="text-xl">Hello?</h2>
          <a
            href="mailto:dalmazo.rafael@gmail.com"
            className="mt-1 block w-fit text-2xl text-black/55 transition-colors hover:text-black dark:text-white/55 dark:hover:text-white"
          >
            dalmazo.rafael@gmail.com
          </a>
        </section>
        <section>
          <h2 className="text-xl">Connect</h2>
          <a
            href="https://www.linkedin.com/in/dalmazo/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block w-fit text-2xl text-black/55 underline underline-offset-4 transition-colors hover:text-black dark:text-white/55 dark:hover:text-white"
          >
            LinkedIn
          </a>
        </section>
      </footer>
    </div>
  );
}
