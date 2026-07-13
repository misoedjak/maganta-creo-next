"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  Trash,
  Upload,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/admin";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  features?: string | null;
  bgImageUrl?: string | null;
  projectCount: number;
  createdAt: Date;
}

interface CategoriesClientProps {
  initialCategories: CategoryItem[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  // Filter categories
  const filteredCategories = initialCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-generate slug from name
  const handleNameChange = (val: string, type: "add" | "edit") => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        setBgImageUrl(data.urls[0]);
        toast.success("Background image uploaded!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    startTransition(async () => {
      try {
        await createCategory({ 
          name, 
          slug, 
          description: description || null, 
          features: features || null, 
          bgImageUrl: bgImageUrl || null 
        });
        toast.success("Category created successfully!");
        setIsAddOpen(false);
        setName("");
        setSlug("");
        setDescription("");
        setFeatures("");
        setBgImageUrl("");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to create category");
      }
    });
  };

  const handleEditClick = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setFeatures(cat.features || "");
    setBgImageUrl(cat.bgImageUrl || "");
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !name || !slug) return;

    startTransition(async () => {
      try {
        await updateCategory(selectedCategory.id, { 
          name, 
          slug, 
          description: description || null, 
          features: features || null, 
          bgImageUrl: bgImageUrl || null 
        });
        toast.success("Category updated successfully!");
        setIsEditOpen(false);
        setSelectedCategory(null);
        setName("");
        setSlug("");
        setDescription("");
        setFeatures("");
        setBgImageUrl("");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to update category");
      }
    });
  };

  const handleDeleteClick = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCategory) return;

    startTransition(async () => {
      try {
        await deleteCategory(selectedCategory.id);
        toast.success("Category deleted successfully!");
        setIsDeleteOpen(false);
        setSelectedCategory(null);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete category");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-gray-200"
          />
        </div>
        <Button 
          onClick={() => {
            setName("");
            setSlug("");
            setDescription("");
            setFeatures("");
            setBgImageUrl("");
            setIsAddOpen(true);
          }}
          className="w-full sm:w-auto bg-[#FFD400] text-black hover:bg-[#e6be00] font-semibold h-10 px-4 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-100">
              <TableHead className="font-semibold text-gray-700 py-4 pl-6">Preview</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">Name</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">Slug</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 text-center">Projects</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((cat) => (
                <TableRow key={cat.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                  <TableCell className="py-4 pl-6">
                    <div className="w-12 h-8 rounded border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                      {cat.bgImageUrl ? (
                        <img src={cat.bgImageUrl} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={14} className="text-gray-300" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 py-4">{cat.name}</TableCell>
                  <TableCell className="text-gray-500 py-4 font-mono text-xs">{cat.slug}</TableCell>
                  <TableCell className="text-gray-900 py-4 text-center">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      {cat.projectCount}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-gray-900 rounded-lg"
                        onClick={() => handleEditClick(cat)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        onClick={() => handleDeleteClick(cat)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md bg-white text-gray-900 rounded-2xl border-none shadow-xl">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-lg font-bold">New Category</DialogTitle>
              <DialogDescription>Create a category to classify event fabrication projects.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-1.5">
                <Label htmlFor="add-name">Category Name</Label>
                <Input
                  id="add-name"
                  placeholder="e.g. Stage Fabrication"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value, "add")}
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-slug">Slug</Label>
                <Input
                  id="add-slug"
                  placeholder="e.g. stage-fabrication"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
              
              {/* Background Image Upload */}
              <div className="space-y-1.5">
                <Label>Card Background Photo</Label>
                <div className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg bg-zinc-50/50">
                  <div className="w-16 h-12 border border-gray-200 rounded overflow-hidden flex items-center justify-center bg-white shrink-0">
                    {bgImageUrl ? (
                      <img src={bgImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white rounded text-xs font-semibold cursor-pointer hover:bg-gray-50 text-gray-700">
                    {isUploading ? (
                      <>
                        <Loader2 size={12} className="animate-spin text-gray-500" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={12} />
                        <span>Upload Background</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading || isPending} />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="add-desc">Service Description</Label>
                <textarea
                  id="add-desc"
                  placeholder="Describe this fabrication service in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isPending}
                  rows={3}
                  className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD400] disabled:opacity-50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-features">Features & Inclusions (Comma-separated)</Label>
                <textarea
                  id="add-features"
                  placeholder="e.g. Custom Double-Deck, RGB Illumination, CNC Precision Cuts"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  disabled={isPending}
                  rows={2}
                  className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD400] disabled:opacity-50"
                />
                <span className="text-[10px] text-gray-400">Separate each feature with a comma.</span>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddOpen(false)}
                disabled={isPending}
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isPending}
                className="bg-[#FFD400] text-black hover:bg-[#e6be00] font-semibold"
              >
                {isPending ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md bg-white text-gray-900 rounded-2xl border-none shadow-xl">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-lg font-bold">Edit Category</DialogTitle>
              <DialogDescription>Modify category settings and details.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g. Stage Fabrication"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value, "edit")}
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  placeholder="e.g. stage-fabrication"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>

              {/* Background Image Upload */}
              <div className="space-y-1.5">
                <Label>Card Background Photo</Label>
                <div className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg bg-zinc-50/50">
                  <div className="w-16 h-12 border border-gray-200 rounded overflow-hidden flex items-center justify-center bg-white shrink-0">
                    {bgImageUrl ? (
                      <img src={bgImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white rounded text-xs font-semibold cursor-pointer hover:bg-gray-50 text-gray-700">
                    {isUploading ? (
                      <>
                        <Loader2 size={12} className="animate-spin text-gray-500" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={12} />
                        <span>Upload Background</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading || isPending} />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-desc">Service Description</Label>
                <textarea
                  id="edit-desc"
                  placeholder="Describe this fabrication service in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isPending}
                  rows={3}
                  className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD400] disabled:opacity-50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-features">Features & Inclusions (Comma-separated)</Label>
                <textarea
                  id="edit-features"
                  placeholder="e.g. Custom Double-Deck, RGB Illumination, CNC Precision Cuts"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  disabled={isPending}
                  rows={2}
                  className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD400] disabled:opacity-50"
                />
                <span className="text-[10px] text-gray-400">Separate each feature with a comma.</span>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditOpen(false)}
                disabled={isPending}
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isPending}
                className="bg-[#FFD400] text-black hover:bg-[#e6be00] font-semibold"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-white text-gray-900 rounded-2xl border-none shadow-xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-bold text-red-600 flex items-center gap-2">
              <Trash className="h-5 w-5" />
              <span>Delete Category</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category <strong>{selectedCategory?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteOpen(false)}
              disabled={isPending}
              className="border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
