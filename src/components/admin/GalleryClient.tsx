"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Upload, 
  Trash2, 
  MoveLeft, 
  MoveRight,
  Loader2,
  Save,
  Image as ImageIcon
} from "lucide-react";
import { addGalleryImage, deleteGalleryImage, reorderGallery } from "@/app/actions/admin";

interface GalleryImage {
  id: string;
  url: string;
  order: number;
}

interface GalleryClientProps {
  initialImages: GalleryImage[];
}

export function GalleryClient({ initialImages }: GalleryClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Images state to handle local sorting changes before save
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Track if order has changed

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      // Loop upload files to API endpoint
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to upload image");
        }

        const data = await res.json();
        uploadedUrls.push(...data.urls);
      }

      // Add each uploaded URL to DB using server actions
      for (const url of uploadedUrls) {
        await addGalleryImage(url);
      }

      toast.success("Images uploaded successfully!");
      setIsDirty(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteGalleryImage(id);
        toast.success("Image deleted successfully!");
        setImages(images.filter((img) => img.id !== id));
        router.refresh();
      } catch (err: any) {
        toast.error("Failed to delete image");
      }
    });
  };

  // Re-ordering logic
  const moveImage = (index: number, direction: "left" | "right") => {
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const reorderedImages = [...images];
    const temp = reorderedImages[index];
    reorderedImages[index] = reorderedImages[newIndex];
    reorderedImages[newIndex] = temp;

    // Recalculate orders
    const mappedImages = reorderedImages.map((img, idx) => ({
      ...img,
      order: idx,
    }));

    setImages(mappedImages);
    setIsDirty(true);
  };

  const handleSaveOrder = async () => {
    startTransition(async () => {
      try {
        const payload = images.map((img) => ({
          id: img.id,
          order: img.order,
        }));
        await reorderGallery(payload);
        toast.success("Gallery order saved!");
        setIsDirty(false);
        router.refresh();
      } catch (err: any) {
        toast.error("Failed to save gallery order");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-gray-900">Upload Media</p>
          <p className="text-xs text-gray-500 mt-0.5">Drag-and-drop or choose files to add to the gallery.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isDirty && (
            <Button
              onClick={handleSaveOrder}
              disabled={isPending}
              className="bg-gray-900 text-white hover:bg-gray-800 font-semibold h-10 rounded-xl flex items-center gap-2 px-4 w-full sm:w-auto"
            >
              <Save className="h-4 w-4" />
              <span>Save Order</span>
            </Button>
          )}
          <label className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-black font-semibold cursor-pointer text-sm transition-colors">
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Choose Files</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading || isPending}
            />
          </label>
        </div>
      </div>

      {/* Media Grid */}
      {images.length === 0 ? (
        <Card className="border-dashed border-gray-200 py-16 bg-white rounded-2xl flex flex-col items-center justify-center text-center">
          <CardContent className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">No photos uploaded yet</p>
              <p className="text-xs text-gray-400">Select files above to populate your installation gallery.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {images.map((img, idx) => (
            <div 
              key={img.id} 
              className="relative bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden group aspect-square flex flex-col justify-between"
            >
              <div className="w-full h-full relative overflow-hidden flex-1 bg-gray-50 border-b border-gray-50">
                <img 
                  src={img.url} 
                  alt="Gallery entry" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Delete Hover Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(img.id)}
                    disabled={isPending}
                    className="h-9 w-9 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Order Controls Bar */}
              <div className="p-2.5 flex items-center justify-between bg-white">
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={idx === 0 || isPending}
                  onClick={() => moveImage(idx, "left")}
                  className="h-7 w-7 rounded-md text-gray-500 hover:text-gray-900 disabled:opacity-30"
                >
                  <MoveLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-[10px] font-bold text-gray-400">#{idx + 1}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={idx === images.length - 1 || isPending}
                  onClick={() => moveImage(idx, "right")}
                  className="h-7 w-7 rounded-md text-gray-500 hover:text-gray-900 disabled:opacity-30"
                >
                  <MoveRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
