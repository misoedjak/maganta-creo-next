import { prisma } from "@/lib/db";
import { AboutSettingsClient } from "@/components/admin/AboutSettingsClient";

export const revalidate = 0;

export default async function AboutSettingsPage() {
  const settings = await prisma.aboutSettings.findFirst();
  const statCards = await prisma.statCard.findMany({
    orderBy: { order: "asc" }
  });

  const defaultSettings = {
    id: "",
    heading: "Dedikasi untuk Kualitas & Presisi",
    paragraph1: "Maganta Kreasi adalah spesialis fabrikasi dan dekorasi event premier di Indonesia. Kami mewujudkan desain event visioner dengan integritas struktural dan kesempurnaan estetika.",
    paragraph2: "Beroperasi dari workshop in-house kami yang luas, tim kami membuat booth pameran custom, panggung festival monumental, dan lingkungan event korporat yang imersif.",
    features: "Workshop Fabrikasi In-house, Material Struktural Premium, Manajer Proyek Terdedikasi"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pengaturan Tentang & Statistik</h1>
        <p className="text-gray-500 mt-1">Kelola paragraf deskripsi, daftar fitur, dan metrik statistik yang ditampilkan di beranda.</p>
      </div>

      <AboutSettingsClient 
        initialSettings={settings || defaultSettings} 
        initialStats={statCards} 
      />
    </div>
  );
}
