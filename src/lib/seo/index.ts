import { APP_CONFIG } from "@/config/constants";

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: APP_CONFIG.name,
    description: APP_CONFIG.description,
    telephone: APP_CONFIG.contact.phone,
    email: APP_CONFIG.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "2-Acre Regenerative Plot, Stakna Village",
      addressLocality: "Leh",
      addressRegion: "Ladakh",
      postalCode: "194201",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "34.0044",
      longitude: "77.6881",
    },
    url: "https://staknafarmhouse.com",
    priceRange: "₹₹",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "07:00",
        closes: "19:00",
      },
    ],
  };
}

export function generateProductSchema(product: {
  title: string;
  description: string;
  images: string[];
  pricePerUnit: number;
  availableQuantity: number;
  slug: string;
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.description,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      url: `https://staknafarmhouse.com/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.pricePerUnit,
      availability:
        product.availableQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: APP_CONFIG.name,
      },
    },
  };
}

export function generateArticleSchema(article: {
  title: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  authorName: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage || "https://staknafarmhouse.com/images/hero.jpg",
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: APP_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: "https://staknafarmhouse.com/favicon.ico",
      },
    },
  };
}
