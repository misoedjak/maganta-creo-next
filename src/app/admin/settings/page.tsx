import { prisma } from "@/lib/db";
import { SettingsClient } from "@/components/admin/SettingsClient";

export const revalidate = 0;

export default async function SettingsPage() {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        siteName: "Maganta Kreasi",
        seoTitle: "Maganta Kreasi - Premium Event Fabrication & Decoration",
        seoDesc: "Jasa fabrikasi booth pameran, panggung event, backdrop dekorasi, gate masuk, dan signage berkualitas tinggi untuk kesuksesan event Anda.",
      }
    });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Website Settings</h1>
        <p className="text-gray-500 mt-1">Configure website global names, defaults for SEO metadata, and third-party tracking tags.</p>
      </div>

      <SettingsClient settings={settings} />
    </div>
  );
}
