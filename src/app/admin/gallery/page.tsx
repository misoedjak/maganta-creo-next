import { prisma } from "@/lib/db";
import { GalleryClient } from "@/components/admin/GalleryClient";

export const revalidate = 0;

export default async function GalleryPage() {
  const images = await prisma.gallery.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gallery</h1>
        <p className="text-gray-500 mt-1">Manage public website photo gallery, workshop fabrication outputs, and event installations.</p>
      </div>

      <GalleryClient initialImages={images} />
    </div>
  );
}
