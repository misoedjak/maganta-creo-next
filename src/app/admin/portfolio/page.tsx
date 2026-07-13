import { prisma } from "@/lib/db";
import { PortfolioList } from "@/components/admin/PortfolioList";

export const revalidate = 0;

export default async function PortfoliosPage() {
  const portfolios = await prisma.portfolio.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Portfolio</h1>
          <p className="text-gray-500 mt-1">Manage project fabrication cases, clients, and installation galleries.</p>
        </div>
      </div>

      <PortfolioList initialPortfolios={portfolios} categories={categories} />
    </div>
  );
}
