"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const quoteRequestSchema = z.object({
  contact: z.string().min(1, "Name is required"),
  company: z.string().nullable().optional(),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  eventType: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  eventDate: z.string().nullable().optional(), // Comes as string from HTML inputs
  budget: z.string().nullable().optional(),
  description: z.string().min(1, "Project brief is required"),
});

export async function submitQuoteRequest(data: z.infer<typeof quoteRequestSchema>) {
  const parsed = quoteRequestSchema.parse(data);

  const quote = await prisma.quoteRequest.create({
    data: {
      contact: parsed.contact,
      company: parsed.company || null,
      phone: parsed.phone,
      email: parsed.email,
      eventType: parsed.eventType || null,
      location: parsed.location || null,
      eventDate: parsed.eventDate ? new Date(parsed.eventDate) : null,
      budget: parsed.budget || null,
      description: parsed.description,
      status: "NEW",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/quotes");
  return { success: true, id: quote.id };
}
