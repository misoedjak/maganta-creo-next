"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  const role = (session.user as any).role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN" && role !== "EDITOR") {
    throw new Error("Forbidden");
  }
  return session;
}

const advantageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  bgImageUrl: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

export async function createAdvantage(data: z.infer<typeof advantageSchema>) {
  await requireAuth();
  const parsed = advantageSchema.parse(data);

  const item = await prisma.advantage.create({
    data: parsed,
  });

  revalidatePath("/");
  revalidatePath("/admin/advantages");
  return item;
}

export async function updateAdvantage(id: string, data: z.infer<typeof advantageSchema>) {
  await requireAuth();
  const parsed = advantageSchema.parse(data);

  const item = await prisma.advantage.update({
    where: { id },
    data: parsed,
  });

  revalidatePath("/");
  revalidatePath("/admin/advantages");
  return item;
}

export async function deleteAdvantage(id: string) {
  await requireAuth();
  await prisma.advantage.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/advantages");
  return true;
}

export async function reorderAdvantages(items: { id: string; order: number }[]) {
  await requireAuth();

  for (const item of items) {
    await prisma.advantage.update({
      where: { id: item.id },
      data: { order: item.order },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/advantages");
  return true;
}
