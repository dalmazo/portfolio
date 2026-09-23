import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export type PostType = "about" | "project" | "blog" | "contact";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  type: PostType;
  summary: string;
  tags?: string[];
  link?: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

function readMarkdownFile(fileName: string) {
  const filePath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  return matter(fileContents);
}

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export function getAllPostsMeta(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const { data } = readMarkdownFile(`${slug}.md`);
      return { slug, ...data } as PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByType(type: PostType): PostMeta[] {
  return getAllPostsMeta().filter((post) => post.type === type);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const { data, content } = readMarkdownFile(`${slug}.md`);
  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);
  return {
    slug,
    contentHtml: processed.toString(),
    ...(data as Omit<PostMeta, "slug">),
  };
}
