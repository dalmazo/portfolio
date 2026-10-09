import PostContent from "@/components/PostContent";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";

export default async function PostArticle({ slug }: { slug: string }) {
  if (!getAllPostSlugs().includes(slug)) notFound();

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
          <p className="mt-1 text-xs opacity-60">Tools: {post.tags.join(" · ")}</p>
        )}
      </header>
      <PostContent html={post.contentHtml} />
    </article>
  );
}
