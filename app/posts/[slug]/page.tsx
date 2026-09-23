import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import PostContent from "@/components/PostContent";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getAllPostSlugs();
  if (!slugs.includes(slug)) notFound();

  const post = await getPostBySlug(slug);

  return (
    <article className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <p className="text-xs opacity-60">{post.date}</p>
        {post.link && (
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-sm underline">
            {post.link}
          </a>
        )}
        {post.tags && post.tags.length > 0 && (
          <p className="text-xs opacity-60 mt-1">Tools: {post.tags.join(" · ")}</p>
        )}
      </header>
      <PostContent html={post.contentHtml} />
    </article>
  );
}
