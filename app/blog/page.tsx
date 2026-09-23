import Link from "next/link";
import { getPostsByType } from "@/lib/posts";

export const metadata = { title: "Blog — Rafael Dalmazo" };

export default function BlogPage() {
  const posts = getPostsByType("blog");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-black/10 dark:border-white/10 pb-4">
            <Link href={`/posts/${post.slug}`} className="text-lg font-medium underline">
              {post.title}
            </Link>
            <p className="text-xs opacity-60">{post.date}</p>
            <p className="text-sm opacity-80">{post.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
