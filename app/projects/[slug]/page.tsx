import PostArticle from "@/components/PostArticle";
import { postMetadata } from "@/lib/metadata";
import { getPostsByType } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPostsByType("project").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  return postMetadata((await params).slug);
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  return <PostArticle slug={slug} type="project" />;
}
