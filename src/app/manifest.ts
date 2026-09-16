import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stakna Farmhouse · High-Altitude Farm & Himalayan Heritage Ladakh",
    short_name: "Stakna Farm",
    description:
      "2-acre regenerative farm in Stakna, Ladakh. Fresh vegetables, flowers, saplings, preserves, and authentic Changthang Pashmina.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#B45309",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
