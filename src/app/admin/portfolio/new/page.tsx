import { prisma } from "@/lib/db";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export const revalidate = 0;

export default async function NewPortfolioPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">New Project</h1>
        <p className="text-gray-500 mt-1">Add a new event fabrication or decoration project to the portfolio.</p>
      </div>

      <PortfolioForm categories={categories} />
    </div>
  );
}
