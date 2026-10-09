import PostArticle from "@/components/PostArticle";
import { getPostsByType } from "@/lib/posts";

export function generateStaticParams() {
  return getPostsByType("project").map(({ slug }) => ({ slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostArticle slug={slug} />;
}
