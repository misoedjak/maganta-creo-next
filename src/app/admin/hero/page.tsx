import { prisma } from "@/lib/db";
import { HeroSettingsClient } from "@/components/admin/HeroSettingsClient";

export const revalidate = 0;

export default async function HeroSettingsPage() {
  const settings = await prisma.heroSettings.findFirst();

  const defaultSettings = {
    id: "",
    heading: "Kontraktor & Vendor Booth Pameran Premium.",
    subheading: "Solusi fabrikasi dan dekorasi event premium. Dari booth pameran custom hingga panggung festival berskala besar.",
    bgImageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop",
    ctaText: "Pesan disini",
    ctaLink: "#contact",
    portfolioText: "Lihat Portofolio",
    portfolioLink: "#portfolio",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pengaturan Hero</h1>
        <p className="text-gray-500 mt-1">Kelola judul, subjudul, foto latar belakang, dan tombol pada bagian utama.</p>
      </div>

      <HeroSettingsClient initialSettings={settings || defaultSettings} />
    </div>
  );
}
