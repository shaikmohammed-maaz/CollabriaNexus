// blogService.js
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export const fetchAllBlogs = async () => {
  try {
    const blogsRef = collection(db, "Blogs");
    const snap = await getDocs(blogsRef);
    return snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d.title || "Untitled",
        slug: d.slug || doc.id,
        author: d.author || "Editorial Team",
        category: d.category || "General",
        imageUrl: d.imageUrl || d.image || "",
        excerpt: d.excerpt || "",
        content: d.content || "",
        status: d.status || "published",
        publishedAt: d.publishedAt || d.createdAt || null,
        updatedAt: d.updatedAt || null,
        tags: Array.isArray(d.tags) ? d.tags : [],
        featured: !!d.featured,
        readingTime: d.readingTime || "",
      };
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    throw err;
  }
};
