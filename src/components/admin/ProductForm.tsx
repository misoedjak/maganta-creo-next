"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Tag, 
  Upload, 
  Trash, 
  Loader2, 
  Check, 
  DollarSign, 
  Briefcase 
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/app/actions/products";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceUnit: string;
  description: string | null;
  image: string | null;
  featured: boolean;
  status: string;
  categoryId: string;
}

interface ProductFormProps {
  categories: Category[];
  initialProduct?: Product;
}

export default function ProductForm({ categories, initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialProduct;

  // Form states
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [price, setPrice] = useState(initialProduct?.price ? String(initialProduct.price) : "");
  const [priceUnit, setPriceUnit] = useState(initialProduct?.priceUnit || "pcs");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [image, setImage] = useState(initialProduct?.image || "");
  const [featured, setFeatured] = useState(initialProduct?.featured || false);
  const [status, setStatus] = useState(initialProduct?.status || "active");
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || (categories[0]?.id || ""));

  // UI/Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const data = await res.json();
      if (res.ok && data.urls && data.urls.length > 0) {
        setImage(data.urls[0]);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (err) {
      toast.error("An error occurred during file upload");
    } finally {
      setIsUploading(false);
    }
  };

  // Form Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error("Please select a category first. If none exist, create one under Categories.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name,
      slug,
      price: parseFloat(price) || 0,
      priceUnit,
      description: description || undefined,
      image: image || undefined,
      featured,
      status,
      categoryId,
    };

    try {
      let res;
      if (isEdit && initialProduct) {
        res = await updateProduct(initialProduct.id, payload);
      } else {
        res = await createProduct(payload);
      }

      if (res.success) {
        toast.success(isEdit ? "Product updated successfully" : "Product created successfully");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(res.error || "An error occurred");
      }
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Top Nav */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back to list
        </Link>
        <h2 className="text-sm font-bold text-gray-900">
          {isEdit ? "Edit Product Settings" : "Create New Product Listing"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main fields (Left Col) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h3 className="font-heading font-bold text-gray-900 text-sm border-b border-gray-50 pb-3">
              General Information
            </h3>

            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Fresnel LED Spotlight"
                className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#be3168] focus:border-[#be3168]"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug URL</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="fresnel-led-spotlight"
                className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#be3168] font-mono"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe product characteristics, usage, output, etc..."
                rows={4}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#be3168]"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h3 className="font-heading font-bold text-gray-900 text-sm border-b border-gray-50 pb-3">
              Pricing Configuration
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (IDR)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">Rp</span>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="400000"
                    className="w-full h-11 pl-10 pr-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#be3168]"
                  />
                </div>
              </div>

              {/* Price Unit */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</label>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#be3168]"
                >
                  <option value="pcs">pcs</option>
                  <option value="package">package</option>
                  <option value="day">day</option>
                  <option value="set">set</option>
                  <option value="unit">unit</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar settings (Right Col) */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-heading font-bold text-gray-900 text-sm border-b border-gray-50 pb-3">Product Image</h3>
            
            {image ? (
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group">
                <img src={image} alt="Upload preview" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-md"
                >
                  <Trash size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-square w-full border-2 border-dashed border-gray-200 hover:border-[#be3168]/50 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-50/50 transition-all text-center p-4">
                {isUploading ? (
                  <Loader2 className="animate-spin text-[#be3168]" size={28} />
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={28} />
                    <span className="text-xs font-semibold text-gray-700">Upload Product Image</span>
                    <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, JPEG</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Properties */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h3 className="font-heading font-bold text-gray-900 text-sm border-b border-gray-50 pb-3">Properties</h3>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
              {categories.length === 0 ? (
                <div className="text-xs text-red-500 font-medium">
                  Create a category first!
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#be3168]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Publish Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#be3168]"
              >
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>

            {/* Featured */}
            <label className="flex items-center gap-3 cursor-pointer select-none py-1 border-t border-gray-50 pt-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-[#be3168] border-gray-300 rounded focus:ring-[#be3168] cursor-pointer"
              />
              <div>
                <span className="text-xs font-semibold text-gray-700 block">Featured Product</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Show badge on listing pages</span>
              </div>
            </label>
          </div>

          {/* Action buttons */}
          <button
            type="submit"
            disabled={isSubmitting || isUploading || categories.length === 0}
            className="w-full flex items-center justify-center gap-2 h-11 bg-[#be3168] hover:bg-[#a32555] active:scale-[0.98] text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#be3168]/15 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Check size={16} /> Save Product
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
