import PostContent from "@/components/PostContent";
import { getPostBySlug, getPostMeta, type PostType } from "@/lib/posts";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format";
import { asset } from "@/lib/asset";

export default async function PostArticle({ slug, type }: { slug: string; type: PostType }) {
  if (getPostMeta(slug)?.type !== type) notFound();

  const post = await getPostBySlug(slug);

  return (
    <article className="space-y-4">
      {post.header && (
        // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized
        <img
          src={asset(post.header)}
          alt={`${post.title} banner`}
          width={1516}
          height={398}
          className="block aspect-[1516/398] w-full rounded-xl object-cover"
        />
      )}
      <header>
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <p className="text-xs opacity-60">{formatDate(post.date)}</p>
        {post.link && (
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-sm underline">
            {post.link}
          </a>
        )}
        {post.tags && post.tags.length > 0 && (
          <p className="mt-1 text-xs opacity-60">Tools: {post.tags.join(" · ")}</p>
        )}
      </header>
      <PostContent html={post.contentHtml} collapsible={post.collapsible} />
    </article>
  );
}
