import { getPostBySlug, getPostsByType } from "@/lib/posts";
import PostContent from "@/components/PostContent";

export const metadata = { title: "Contact — Rafael Dalmazo" };

export default async function ContactPage() {
  const [contact] = getPostsByType("contact");

  if (!contact) {
    return <p>No contact page found. Add one to posts/ with type: &quot;contact&quot;.</p>;
  }

  const post = await getPostBySlug(contact.slug);

  return <PostContent html={post.contentHtml} />;
}
