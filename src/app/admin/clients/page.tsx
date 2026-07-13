import { prisma } from "@/lib/db";
import { ClientsClient } from "@/components/admin/ClientsClient";

export const revalidate = 0;

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Clients & Testimonials</h1>
          <p className="text-gray-500 mt-1">Manage partner logos and case study feedback narratives.</p>
        </div>
      </div>
      
      <ClientsClient initialClients={clients} />
    </div>
  );
}
