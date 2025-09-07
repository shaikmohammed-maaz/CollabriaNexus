import React, { useMemo, useState } from "react";
import { db } from "./firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const slugify = (str) =>
  String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function AdminBlog() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("Editorial Team");
  const [category, setCategory] = useState("General");
  const [imageUrl, setImageUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [status, setStatus] = useState("published"); // 'published' | 'draft'
  const [featured, setFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { type: 'success'|'error', message: string }

  // Auto-derive slug from title if slug is empty or matches prior title slug
  const autoSlug = useMemo(() => slugify(title), [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    const finalTitle = title.trim();
    const finalContent = content.trim();

    if (!finalTitle || !finalContent) {
      setResult({ type: "error", message: "Title and Content are required." });
      return;
    }

    const finalSlugRaw = slug.trim() || autoSlug;
    const finalSlug = slugify(finalSlugRaw) || undefined;

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: finalTitle,
      slug: finalSlug,
      author: author.trim() || "Editorial Team",
      category: category.trim() || "General",
      imageUrl: imageUrl.trim() || "",
      excerpt: excerpt.trim(),
      content: finalContent,
      status: status === "draft" ? "draft" : "published",
      featured: !!featured,
      tags,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: status === "published" ? serverTimestamp() : null,
    };

    try {
      setSubmitting(true);
      await addDoc(collection(db, "Blogs"), payload);
      setResult({ type: "success", message: "Blog post created successfully." });
      // Reset minimal fields, keep author/category for convenience
      setTitle("");
      setSlug("");
      setImageUrl("");
      setExcerpt("");
      setContent("");
      setTagsText("");
      setFeatured(false);
      setStatus("published");
    } catch (err) {
      console.error("Error creating blog:", err);
      setResult({ type: "error", message: err?.message || "Failed to create blog." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:px-6 lg:px-8 bg-[#0f0f1a] text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create Blog Post</h1>
        <p className="text-sm text-gray-400 mb-6">
          Basic admin form to publish or save draft blog posts into Firestore (collection: <code>Blogs</code>).
        </p>

        {result && (
          <div
            className={`mb-4 px-3 py-2 rounded ${
              result.type === "success" ? "bg-green-600/20 text-green-300" : "bg-red-600/20 text-red-300"
            }`}
          >
            {result.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1d1d2e] border border-[#2b2b46] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#1d1d2e] border border-[#2b2b46] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder={autoSlug || "auto-generated from title"}
              />
              <div className="text-xs text-gray-500 mt-1">Auto: {autoSlug || ""}</div>
            </div>
            <div>
              <label className="block text-sm mb-1">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#1d1d2e] border border-[#2b2b46] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Editorial Team"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1d1d2e] border border-[#2b2b46] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="e.g., Education, Market Insights, Security"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#1d1d2e] border border-[#2b2b46] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full bg-[#1d1d2e] border border-[#2b2b46] rounded px-3 py-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Short summary for the card"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#1d1d2e] border border-[#2b2b46] rounded px-3 py-2 text-sm h-64 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Full article content"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                className="w-full bg-[#1d1d2e] border border-[#2b2b46] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="e.g., crypto, mining, guide"
              />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#1d1d2e] border border-[#2b2b46] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <label className="inline-flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span className="text-sm">Featured</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2 rounded-md text-sm font-medium ${
                submitting ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-xs text-gray-500">
          <p>Fields stored to Firestore (collection: Blogs): title, slug, author, category, imageUrl, excerpt, content, status, featured, tags, createdAt, updatedAt, publishedAt.</p>
        </div>
      </div>
    </div>
  );
}
