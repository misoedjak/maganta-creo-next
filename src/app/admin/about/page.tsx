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
    heading: "Precision Engineering, Exceptional Craftsmanship.",
    paragraph1: "Maganta Kreasi is Indonesia's premier event fabrication and decoration specialist. We bring visionary event designs to life with unparalleled structural integrity and aesthetic perfection.",
    paragraph2: "Operating from our massive in-house workshop, our team of structural engineers, carpenters, and visual artists craft bespoke exhibition booths, monumental festival stages, and immersive corporate event environments.",
    features: "In-house Fabrication Workshop, Premium Structural Materials, Dedicated Project Managers"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">About & Stats Settings</h1>
        <p className="text-gray-500 mt-1">Manage description paragraphs, feature lists, and the numeric metrics cards displayed on the home page.</p>
      </div>

      <AboutSettingsClient 
        initialSettings={settings || defaultSettings} 
        initialStats={statCards} 
      />
    </div>
  );
}
