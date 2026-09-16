import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { BlogPost } from "@/models/BlogPost";
import { connectDB } from "@/lib/db/connect";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = await BlogPost.findOne({ slug, isPublished: true });

  if (!post) {
    return { title: "Article Not Found | Yarkha Farm" };
  }

  return {
    title: `${post.title} | Yarkha Farm Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.featuredImage || "/images/dining.jpg" }],
    },
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const post = await BlogPost.findOne({ slug, isPublished: true });

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.featuredImage,
    datePublished: post.publishedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Yarkha Farm Ladakh",
    },
    description: post.excerpt,
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="py-12 sm:py-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#B45309] font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Farm Journal</span>
          </Link>

          <header className="mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-[#B45309] mb-2 block">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-[#78716C] border-y border-stone-200 py-3">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#B45309]" />
                <span>{post.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#B45309]" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </span>
            </div>
          </header>

          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-10 shadow-lg border border-stone-200 bg-stone-100">
            <Image
              src={post.featuredImage || "/images/dining.jpg"}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <div
            className="prose prose-stone prose-sm sm:prose-base max-w-none text-[#44403C] leading-relaxed font-light"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-stone-200 flex flex-wrap gap-2 items-center text-xs">
              <Tag className="w-3.5 h-3.5 text-[#78716C]" />
              {post.tags.map((tag: string, idx: number) => (
                <span key={idx} className="bg-white border border-stone-200 px-3 py-1 rounded-full text-stone-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>

      <StoreFooter />
    </div>
  );
}
