import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

import ClientProviders from "@/components/providers/ClientProviders";
import { generateLocalBusinessSchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL("https://staknafarmhouse.com"),
  title: "Stakna Farmhouse | High-Altitude Farm, Living Soil & Authentic Himalayan Heritage · Ladakh",
  description:
    "A 2-acre regenerative farm and eco-living plot in Stakna, Ladakh at 3,250m. Pure Indus glacial melt, passive solar greenhouses, organic produce, cold-hardy saplings, and handspun Changthang Pashmina.",
  keywords: [
    "Stakna Farmhouse",
    "Yarkha",
    "Ladakh organic farming",
    "fresh vegetables Leh",
    "Changthang Pashmina wool",
    "Halman apricot saplings",
    "high altitude passive solar greenhouse",
    "Indus river retreat"
  ],
  openGraph: {
    title: "Stakna Farmhouse | High-Altitude Regenerative Farm · Ladakh",
    description:
      "Nourished by Indus glacial melt and passive solar greenhouses at 3,250 meters beneath Stakna Monastery.",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 675,
        alt: "Stakna Farmhouse Ladakh"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Stakna Farmhouse | Ladakh",
    description:
      "A 2-acre regenerative farm along the Indus River beneath Stakna Monastery.",
    images: ["/images/hero.jpg"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F2] text-[#1C1917] selection:bg-[#D97706]/20 selection:text-[#78350F]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateLocalBusinessSchema()) }}
        />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
