import { prisma } from "@/lib/db";
import { QuotesClient } from "@/components/admin/QuotesClient";

export const revalidate = 0;

export default async function QuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quote Requests</h1>
        <p className="text-gray-500 mt-1">Manage project quotes, leads, and event fabrication briefs.</p>
      </div>

      <QuotesClient initialQuotes={quotes} />
    </div>
  );
}
