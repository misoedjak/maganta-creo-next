import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export const revalidate = 0;

export default async function AdminNewProductPage() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <ProductForm categories={categories} />
    </div>
  );
}
