import { getPostBySlug, getPostsByType } from "@/lib/posts";
import PostContent from "@/components/PostContent";
import Link from "next/link";

export default async function HomePage() {
  const [about] = getPostsByType("about");
  const projects = getPostsByType("project").slice(0, 3);

  if (!about) {
    return <p>No about page found. Add one to posts/ with type: &quot;about&quot;.</p>;
  }

  const post = await getPostBySlug(about.slug);

  return (
    <div className="space-y-10">
      <PostContent html={post.contentHtml} />

      {projects.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Recent projects</h2>
          <ul className="space-y-2">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/posts/${project.slug}`} className="underline">
                  {project.title}
                </Link>
                <p className="text-sm opacity-80">{project.summary}</p>
              </li>
            ))}
          </ul>
          <Link href="/projects" className="text-sm underline">
            See all projects →
          </Link>
        </section>
      )}
    </div>
  );
}
