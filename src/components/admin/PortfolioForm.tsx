"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Upload, 
  Trash2, 
  ArrowLeft, 
  Loader2,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import { createPortfolio, updatePortfolio } from "@/app/actions/admin";

interface PortfolioFormData {
  id?: string;
  title: string;
  slug: string;
  client: string;
  categoryId: string;
  projectDate: Date | null;
  location: string;
  description: string;
  thumbnail: string;
  featured: boolean;
  status: string;
  seoTitle: string;
  seoDesc: string;
  images: string[];
}

interface PortfolioFormProps {
  categories: { id: string; name: string }[];
  initialData?: PortfolioFormData;
}

export function PortfolioForm({ categories, initialData }: PortfolioFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditMode = !!initialData;

  // Form Fields State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [client, setClient] = useState(initialData?.client || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || (categories[0]?.id || ""));
  
  // Format Date for Input Value (YYYY-MM-DD)
  const formatInputDate = (dateObj: Date | null | undefined) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  };
  const [projectDate, setProjectDate] = useState(formatInputDate(initialData?.projectDate));
  
  const [location, setLocation] = useState(initialData?.location || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seoDesc || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  // Upload States
  const [isThumbUploading, setIsThumbUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditMode) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsThumbUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setThumbnail(data.urls[0]);
      toast.success("Thumbnail uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload thumbnail");
    } finally {
      setIsThumbUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsGalleryUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Gallery upload failed");

        const data = await res.json();
        uploadedUrls.push(...data.urls);
      }

      setImages([...images, ...uploadedUrls]);
      toast.success("Gallery images added!");
    } catch (err) {
      toast.error("Failed to upload gallery images");
    } finally {
      setIsGalleryUploading(false);
    }
  };

  const removeGalleryImage = (idxToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description || !thumbnail || !categoryId) {
      toast.error("Please fill in all required fields (Title, Slug, Category, Description, and Thumbnail).");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          title,
          slug,
          client: client || null,
          categoryId,
          projectDate: projectDate ? new Date(projectDate) : null,
          location: location || null,
          description,
          thumbnail,
          featured,
          status,
          seoTitle: seoTitle || null,
          seoDesc: seoDesc || null,
          images,
        };

        if (isEditMode && initialData?.id) {
          await updatePortfolio(initialData.id, payload);
          toast.success("Project updated successfully!");
        } else {
          await createPortfolio(payload);
          toast.success("Project created successfully!");
        }

        router.push("/admin/portfolio");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to save project");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Back Button */}
      <div className="flex items-center">
        <Link 
          href="/admin/portfolio" 
          className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolios</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Fields Form (Takes 2 Columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Information Card */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">Project Details</CardTitle>
              <CardDescription>Enter project title, slug, client names, locations, and descriptions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label htmlFor="project-title">Project Title *</Label>
                  <Input
                    id="project-title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Custom Exhibition Booth for Company X"
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="project-slug">Slug (URL) *</Label>
                  <Input
                    id="project-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. custom-exhibition-booth-company-x"
                    required
                    disabled={isPending || isEditMode}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <Label htmlFor="project-client">Client Name</Label>
                  <Input
                    id="project-client"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Bank Mandiri"
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="project-date">Project Date</Label>
                  <Input
                    id="project-date"
                    type="date"
                    value={projectDate}
                    onChange={(e) => setProjectDate(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="project-location">Location</Label>
                  <Input
                    id="project-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. JCC Senayan, Jakarta"
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project-desc">Description *</Label>
                <textarea
                  id="project-desc"
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400] disabled:bg-gray-50"
                  placeholder="Explain event requirements, stage scale, materials, and challenges overcome..."
                  required
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Attachments (Gallery) */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">Project Gallery</CardTitle>
              <CardDescription>Attach high-definition photos of the finished fabrication setup.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Dropzone */}
              <div className="border border-dashed border-gray-200 p-8 rounded-xl bg-gray-50/50 flex flex-col items-center justify-center text-center">
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                    {isGalleryUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Upload className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {isGalleryUploading ? "Uploading gallery..." : "Upload gallery images"}
                  </span>
                  <span className="text-xs text-gray-400">Select multiple event photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleGalleryUpload}
                    disabled={isGalleryUploading || isPending}
                  />
                </label>
              </div>

              {/* Gallery Grid preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 group">
                      <img 
                        src={url} 
                        alt="Gallery preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => removeGalleryImage(idx)}
                          className="h-8 w-8 bg-red-600 hover:bg-red-700 rounded-md"
                          disabled={isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar settings (Takes 1 Column) */}
        <div className="space-y-8">
          {/* Classification & Settings */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-900">Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <Label htmlFor="project-category">Category *</Label>
                <select
                  id="project-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  disabled={isPending}
                  className="w-full h-10 border border-gray-200 bg-white rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <Label htmlFor="project-status">Publish Status</Label>
                <select
                  id="project-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isPending}
                  className="w-full h-10 border border-gray-200 bg-white rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                >
                  <option value="draft">Draft (Hidden)</option>
                  <option value="published">Published (Live)</option>
                </select>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <Label htmlFor="project-featured" className="font-semibold text-sm">Featured Project</Label>
                  <p className="text-[10px] text-gray-400 mt-0.5">Feature this project prominently on the homepage.</p>
                </div>
                <input
                  id="project-featured"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  disabled={isPending}
                  className="h-4 w-4 rounded border-gray-300 text-[#FFD400] focus:ring-[#FFD400]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Thumbnail Image */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-900">Thumbnail Cover *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {thumbnail ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img 
                    src={thumbnail} 
                    alt="Thumbnail cover" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => setThumbnail("")}
                      className="h-7 w-7 bg-red-600 hover:bg-red-700 rounded-md text-white shadow-sm"
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-6 text-center">
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <div className="w-9 h-9 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                      {isThumbUploading ? (
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      ) : (
                        <Upload className="h-4.5 w-4.5" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      {isThumbUploading ? "Uploading..." : "Upload cover image"}
                    </span>
                    <span className="text-[10px] text-gray-400">Main card display</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbUpload}
                      disabled={isThumbUploading || isPending}
                    />
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Metadata Card */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-900">SEO Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="project-seotitle">Meta Title</Label>
                <Input
                  id="project-seotitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Defaults to Project Title"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="project-seodesc">Meta Description</Label>
                <textarea
                  id="project-seodesc"
                  rows={3}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full border border-gray-200 bg-white rounded-md p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#FFD400] disabled:bg-gray-50"
                  placeholder="Write search description..."
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end gap-3 pb-12 border-t border-gray-200 pt-6">
        <Link href="/admin/portfolio">
          <Button 
            type="button" 
            variant="outline" 
            className="border-gray-200 hover:bg-gray-50 text-gray-700"
            disabled={isPending}
          >
            Cancel
          </Button>
        </Link>
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-[#FFD400] text-black hover:bg-[#e6be00] font-semibold h-10 px-6 rounded-xl flex items-center gap-2"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isEditMode ? "Save Changes" : "Create Project"}</span>
        </Button>
      </div>
    </form>
  );
}
