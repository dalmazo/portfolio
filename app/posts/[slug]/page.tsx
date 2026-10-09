import PostArticle from "@/components/PostArticle";
import { getAllPostSlugs } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostArticle slug={slug} />;
}
