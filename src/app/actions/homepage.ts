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

// 1. Hero Settings Validation Schema
const heroSettingsSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().min(1, "Subheading is required"),
  bgImageUrl: z.string().min(1, "Background image URL is required"),
  ctaText: z.string().min(1, "CTA button text is required"),
  ctaLink: z.string().min(1, "CTA link is required"),
  portfolioText: z.string().min(1, "Portfolio button text is required"),
  portfolioLink: z.string().min(1, "Portfolio link is required"),
});

export async function updateHeroSettings(data: z.infer<typeof heroSettingsSchema>) {
  await requireAuth();
  const parsed = heroSettingsSchema.parse(data);

  // Since we only maintain a single settings record, find or create
  const record = await prisma.heroSettings.findFirst();
  if (record) {
    await prisma.heroSettings.update({
      where: { id: record.id },
      data: parsed,
    });
  } else {
    await prisma.heroSettings.create({
      data: parsed,
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/hero");
  return true;
}

// 2. About Settings Validation Schema
const aboutSettingsSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  paragraph1: z.string().min(1, "Paragraph 1 is required"),
  paragraph2: z.string().min(1, "Paragraph 2 is required"),
  features: z.string().default(""), // Comma-separated highlights list
});

export async function updateAboutSettings(data: z.infer<typeof aboutSettingsSchema>) {
  await requireAuth();
  const parsed = aboutSettingsSchema.parse(data);

  const record = await prisma.aboutSettings.findFirst();
  if (record) {
    await prisma.aboutSettings.update({
      where: { id: record.id },
      data: parsed,
    });
  } else {
    await prisma.aboutSettings.create({
      data: parsed,
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/about");
  return true;
}

// 3. Stat Card Validation Schema
const statCardSchema = z.object({
  number: z.string().min(1, "Number is required"),
  label: z.string().min(1, "Label is required"),
  order: z.number().int().default(0),
});

export async function createStatCard(data: z.infer<typeof statCardSchema>) {
  await requireAuth();
  const parsed = statCardSchema.parse(data);

  const item = await prisma.statCard.create({
    data: parsed,
  });

  revalidatePath("/");
  revalidatePath("/admin/about");
  return item;
}

export async function updateStatCard(id: string, data: z.infer<typeof statCardSchema>) {
  await requireAuth();
  const parsed = statCardSchema.parse(data);

  const item = await prisma.statCard.update({
    where: { id },
    data: parsed,
  });

  revalidatePath("/");
  revalidatePath("/admin/about");
  return item;
}

export async function deleteStatCard(id: string) {
  await requireAuth();
  await prisma.statCard.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/about");
  return true;
}

export async function reorderStatCards(items: { id: string; order: number }[]) {
  await requireAuth();

  for (const item of items) {
    await prisma.statCard.update({
      where: { id: item.id },
      data: { order: item.order },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/about");
  return true;
}
