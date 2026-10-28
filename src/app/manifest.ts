import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "An Mệnh – Hiểu mình hơn, sống hài hòa hơn",
    short_name: "An Mệnh",
    description: "Tra cứu bản mệnh, ngũ hành, phong thủy Bát trạch, thần số học và rút thẻ chiêm nghiệm.",
    lang: "vi",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0d1524",
    theme_color: "#0d1524",
    categories: ["lifestyle", "entertainment"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
