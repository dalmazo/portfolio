import PostArticle from "@/components/PostArticle";
import { getPostsByType } from "@/lib/posts";

export function generateStaticParams() {
  return getPostsByType("blog").map(({ slug }) => ({ slug }));
}

export default async function NotesArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostArticle slug={slug} />;
}
