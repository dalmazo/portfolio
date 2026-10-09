import PostArticle from "@/components/PostArticle";
import { getAllNoteSlugs } from "@/lib/posts";

export function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug }));
}

export default async function NotesArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostArticle slug={slug} />;
}
