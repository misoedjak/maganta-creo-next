import { prisma } from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://maganta-creo-next.vercel.app";

  let portfolioUrls: any[] = [];
  try {
    // Fetch dynamic portfolio slugs from database
    const portfolios = await prisma.portfolio.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true }
    });

    portfolioUrls = portfolios.map((p) => ({
      url: `${baseUrl}/portfolio/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error("Failed to query portfolios for sitemap generation:", err);
  }

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/clients`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  return [...staticRoutes, ...portfolioUrls];
}
