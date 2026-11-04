import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/nos-creations", priority: 0.9, changeFrequency: "weekly" },
  { path: "/gateaux-sur-mesure", priority: 0.9, changeFrequency: "monthly" },
  { path: "/notre-maison", priority: 0.7, changeFrequency: "monthly" },
  { path: "/nous-trouver", priority: 0.8, changeFrequency: "monthly" },
  { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
