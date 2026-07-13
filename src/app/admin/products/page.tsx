import { prisma } from "@/lib/db";
import ProductsClient from "@/components/admin/ProductsClient";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          name: true
        }
      }
    },
    orderBy: { name: "asc" }
  });

  const categories = await prisma.productCategory.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <ProductsClient 
        initialProducts={products} 
        initialCategories={categories} 
      />
    </div>
  );
}
