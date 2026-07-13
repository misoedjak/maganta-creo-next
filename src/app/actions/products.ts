"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- CATEGORIES ---

export async function getProductCategories() {
  try {
    return await prisma.productCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  } catch (error) {
    console.error("Failed to fetch product categories:", error);
    return [];
  }
}

export async function createProductCategory(data: { name: string; slug: string }) {
  try {
    const category = await prisma.productCategory.create({
      data
    });
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, category };
  } catch (error) {
    console.error("Failed to create product category:", error);
    return { success: false, error: "Failed to create category. Name or slug might be already taken." };
  }
}

export async function deleteProductCategory(id: string) {
  try {
    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: id }
    });
    
    if (productCount > 0) {
      return { success: false, error: "Cannot delete category because it contains active products." };
    }

    await prisma.productCategory.delete({
      where: { id }
    });
    
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product category:", error);
    return { success: false, error: "Failed to delete category." };
  }
}

// --- PRODUCTS ---

export async function getProducts(categoryId?: string) {
  try {
    return await prisma.product.findMany({
      where: categoryId && categoryId !== "all" ? { categoryId } : undefined,
      include: {
        category: true
      },
      orderBy: { name: "asc" }
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true
      }
    });
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    return null;
  }
}

export async function createProduct(data: {
  name: string;
  slug: string;
  price: number;
  priceUnit: string;
  description?: string;
  image?: string;
  featured: boolean;
  status: string;
  categoryId: string;
}) {
  try {
    const product = await prisma.product.create({
      data
    });
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product. Slug might already be in use." };
  }
}

export async function updateProduct(
  id: string,
  data: {
    name: string;
    slug: string;
    price: number;
    priceUnit: string;
    description?: string;
    image?: string;
    featured: boolean;
    status: string;
    categoryId: string;
  }
) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data
    });
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product. Slug might already be in use." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product." };
  }
}
