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

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logoUrl: z.string().min(1, "Logo image is required"),
  order: z.number().int().default(0),
  event: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  feedback: z.string().nullable().optional(),
  stat: z.string().nullable().optional(),
});

export async function createClient(data: z.infer<typeof clientSchema>) {
  await requireAuth();
  const parsed = clientSchema.parse(data);

  const item = await prisma.client.create({
    data: parsed,
  });

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/admin/clients");
  return item;
}

export async function updateClient(id: string, data: z.infer<typeof clientSchema>) {
  await requireAuth();
  const parsed = clientSchema.parse(data);

  const item = await prisma.client.update({
    where: { id },
    data: parsed,
  });

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/admin/clients");
  return item;
}

export async function deleteClient(id: string) {
  await requireAuth();
  await prisma.client.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/admin/clients");
  return true;
}

export async function reorderClients(items: { id: string; order: number }[]) {
  await requireAuth();

  for (const item of items) {
    await prisma.client.update({
      where: { id: item.id },
      data: { order: item.order },
    });
  }

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/admin/clients");
  return true;
}
