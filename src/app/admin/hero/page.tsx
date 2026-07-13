import { prisma } from "@/lib/db";
import { HeroSettingsClient } from "@/components/admin/HeroSettingsClient";

export const revalidate = 0;

export default async function HeroSettingsPage() {
  const settings = await prisma.heroSettings.findFirst();

  const defaultSettings = {
    id: "",
    heading: "Premium Event Fabrication & Design.",
    subheading: "Premium Event Fabrication & Decoration Solutions. From Custom Exhibition Booths to Massive Festival Stages.",
    bgImageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop",
    ctaText: "Get a Quote",
    ctaLink: "#contact",
    portfolioText: "View Portfolio",
    portfolioLink: "#portfolio",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hero Section Settings</h1>
        <p className="text-gray-500 mt-1">Manage titles, subtitles, background banner photos, and buttons in the landing section.</p>
      </div>

      <HeroSettingsClient initialSettings={settings || defaultSettings} />
    </div>
  );
}
