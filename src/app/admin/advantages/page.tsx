import { prisma } from "@/lib/db";
import { AdvantagesClient } from "@/components/admin/AdvantagesClient";

export const revalidate = 0;

export default async function AdvantagesPage() {
  const advantages = await prisma.advantage.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Advantages</h1>
          <p className="text-gray-500 mt-1">Manage content cards for &quot;The Maganta Advantage&quot; section.</p>
        </div>
      </div>
      
      <AdvantagesClient initialAdvantages={advantages} />
    </div>
  );
}
