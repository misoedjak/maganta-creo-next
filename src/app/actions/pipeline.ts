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

const pipelineStepSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  bgImageUrl: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

export async function createPipelineStep(data: z.infer<typeof pipelineStepSchema>) {
  await requireAuth();
  const parsed = pipelineStepSchema.parse(data);

  const item = await prisma.pipelineStep.create({
    data: parsed,
  });

  revalidatePath("/");
  revalidatePath("/admin/pipeline");
  return item;
}

export async function updatePipelineStep(id: string, data: z.infer<typeof pipelineStepSchema>) {
  await requireAuth();
  const parsed = pipelineStepSchema.parse(data);

  const item = await prisma.pipelineStep.update({
    where: { id },
    data: parsed,
  });

  revalidatePath("/");
  revalidatePath("/admin/pipeline");
  return item;
}

export async function deletePipelineStep(id: string) {
  await requireAuth();
  await prisma.pipelineStep.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/pipeline");
  return true;
}

export async function reorderPipelineSteps(items: { id: string; order: number }[]) {
  await requireAuth();

  for (const item of items) {
    await prisma.pipelineStep.update({
      where: { id: item.id },
      data: { order: item.order },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/pipeline");
  return true;
}
