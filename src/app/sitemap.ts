import { MetadataRoute } from "next";
import { productRepository } from "@/repositories/productRepository";
import { BlogPost } from "@/models/BlogPost";
import { connectDB } from "@/lib/db/connect";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yarkhafarm.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/vegetables`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/flowers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/saplings`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/value-added`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pashmina`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/farmstay`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/farm-story`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pashmina-heritage`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/seasonal`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/farm-baskets`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/custom-flowers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    const productsData = await productRepository.list({ limit: 100 });
    const productRoutes: MetadataRoute.Sitemap = productsData.products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    await connectDB();
    const blogPosts = await BlogPost.find({ isPublished: true });
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...blogRoutes];
  } catch (e) {
    return staticRoutes;
  }
}
