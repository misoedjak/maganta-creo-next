import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import { redirect } from "next/navigation";

export const revalidate = 0;

interface EditProductPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    redirect("/admin/products");
  }

  const categories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <ProductForm categories={categories} initialProduct={product} />
    </div>
  );
}
