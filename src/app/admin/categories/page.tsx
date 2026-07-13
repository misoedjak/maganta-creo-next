import { prisma } from "@/lib/db";
import { CategoriesClient } from "@/components/admin/CategoriesClient";

export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { portfolios: true }
      }
    }
  });

  // Map database properties to match expected client model
  const mappedCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    features: cat.features,
    bgImageUrl: cat.bgImageUrl,
    projectCount: cat._count.portfolios,
    createdAt: cat.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-gray-500 mt-1">Manage project types and event fabrication categories.</p>
        </div>
      </div>
      
      <CategoriesClient initialCategories={mappedCategories} />
    </div>
  );
}
