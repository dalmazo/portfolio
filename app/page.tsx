import { getPostBySlug, getPostsByType } from "@/lib/posts";
import PostContent from "@/components/PostContent";
import Link from "next/link";

export default async function HomePage() {
  const [about] = getPostsByType("about");
  const projects = getPostsByType("project");

  if (!about) {
    return <p>No about page found. Add one to posts/ with type: &quot;about&quot;.</p>;
  }

  const post = await getPostBySlug(about.slug);

  return (
    <div className="space-y-10">
      <PostContent html={post.contentHtml} />

      {projects.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-6">Projects</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((project) => (
              <li key={project.slug} className="min-w-0">
                <Link
                  href={`/posts/${project.slug}`}
                  className="group flex aspect-video flex-col justify-end overflow-hidden border border-black/10 bg-black/[0.03] p-5 no-underline transition-colors hover:bg-black/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                >
                  <span className="text-lg font-semibold">{project.title}</span>
                  <span className="mt-1 text-sm leading-relaxed opacity-75">
                    {project.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
