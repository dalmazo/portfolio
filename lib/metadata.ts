import type { Metadata } from "next";
import { asset, isVideo } from "@/lib/asset";
import { getPostMeta } from "@/lib/posts";

export const siteName = "Rafael Dalmazo";

// Title, description and link-preview image for a project or note page.
export function postMetadata(slug: string): Metadata {
  const post = getPostMeta(slug);
  if (!post) return {};

  const image = post.cover && !isVideo(post.cover) ? asset(post.cover) : undefined;
  return {
    title: `${post.title} — ${siteName}`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName,
      type: "article",
      images: image ? [image] : undefined,
    },
  };
}
