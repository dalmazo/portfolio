import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const contentDirectories = {
  posts: path.join(process.cwd(), "posts"),
  notes: path.join(process.cwd(), "notes"),
} as const;

export type PostType = "about" | "project" | "blog" | "contact";
export type ContentCollection = keyof typeof contentDirectories;

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

function readMarkdownFile(fileName: string, collection: ContentCollection) {
  const filePath = path.join(contentDirectories[collection], fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  return matter(fileContents);
}

function getSlugs(collection: ContentCollection): string[] {
  return fs
    .readdirSync(contentDirectories[collection])
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

function getPostsMeta(collection: ContentCollection): PostMeta[] {
  return getSlugs(collection)
    .map((slug) => {
      const { data } = readMarkdownFile(`${slug}.md`, collection);
      return { slug, ...data } as PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostSlugs(): string[] {
  return getSlugs("posts");
}

export function getAllNoteSlugs(): string[] {
  return getSlugs("notes");
}

export function getAllPostsMeta(): PostMeta[] {
  return [...getPostsMeta("posts"), ...getPostsMeta("notes")].sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
}

export function getPostsByType(type: PostType): PostMeta[] {
  return getAllPostsMeta().filter((post) => post.type === type);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const collection = getSlugs("posts").includes(slug) ? "posts" : "notes";
  const { data, content } = readMarkdownFile(`${slug}.md`, collection);
  const basePath = process.env.GITHUB_ACTIONS === "true" ? "/portfolio" : "";
  const markdown = content.replace(
    /(```video[ \t]*\r?\n)\/(videos\/[^\r\n]+)/g,
    `$1${basePath}/$2`,
  );
  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(markdown);
  const contentHtml = processed
    .toString()
    .replace(/(<img\b[^>]*\bsrc=")\/(?!\/)/g, `$1${basePath}/`);
  return {
    slug,
    contentHtml,
    ...(data as Omit<PostMeta, "slug">),
  };
}
