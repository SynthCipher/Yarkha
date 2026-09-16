import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { BlogPost } from "@/models/BlogPost";
import { connectDB } from "@/lib/db/connect";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Farm Journal & High-Altitude Agriculture | Yarkha Farm Ladakh",
  description:
    "Stories, regenerative agricultural practices, passive solar greenhouse innovations, and seasonal recipes from Stakna, Ladakh.",
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  await connectDB();
  const posts = await BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#92400E] text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>The Indus Valley Journal</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
              Stories from the Soil
            </h1>
            <p className="text-xs sm:text-sm text-[#78716C] mt-2 font-light">
              Explorations in high-altitude Himalayan horticulture, greenhouse architecture, and local culinary heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post._id.toString()}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <Image
                    src={post.featuredImage || "/images/dining.jpg"}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1C1917]/80 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-[#78716C] mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        <span>{post.author}</span>
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-serif font-bold text-xl text-[#1C1917] group-hover:text-[#B45309] transition-colors leading-snug">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-[#57534E] mt-2 line-clamp-3 font-light leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold uppercase tracking-wider text-[#B45309] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
