"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  FolderTree, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Tag, 
  Star, 
  Check, 
  X,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { 
  deleteProduct, 
  createProductCategory, 
  deleteProductCategory 
} from "@/app/actions/products";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceUnit: string;
  image: string | null;
  featured: boolean;
  status: string;
  categoryId: string;
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

interface ProductsClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function ProductsClient({ initialProducts, initialCategories }: ProductsClientProps) {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  
  // Search / filter states
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // New Category form states
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  // Loading states
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success("Product deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete product");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the product");
    } finally {
      setDeletingId(null);
    }
  };

  // Generate slug automatically
  const handleCatNameChange = (val: string) => {
    setNewCatName(val);
    setNewCatSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  // Handle category creation
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    setIsSubmittingCat(true);

    try {
      const res = await createProductCategory({ name: newCatName, slug: newCatSlug });
      if (res.success && res.category) {
        setCategories(prev => [...prev, { ...res.category!, _count: { products: 0 } }].sort((a,b) => a.name.localeCompare(b.name)));
        toast.success("Category created successfully");
        setNewCatName("");
        setNewCatSlug("");
        setShowAddCat(false);
      } else {
        toast.error(res.error || "Failed to create category");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmittingCat(false);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    
    try {
      const res = await deleteProductCategory(id);
      if (res.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
        toast.success("Category deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete category");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      p.category.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.categoryId === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace("IDR", "Rp");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="text-[#be3168]" size={24} /> Product Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage rental equipment, packages, prices, and categories.</p>
        </div>
        
        {activeTab === "products" ? (
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#be3168] text-white rounded-xl text-sm font-semibold hover:bg-[#a32555] active:scale-[0.98] transition-all shadow-md shadow-[#be3168]/15"
          >
            <Plus size={16} /> Add Product
          </Link>
        ) : (
          <button
            onClick={() => setShowAddCat(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#be3168] text-white rounded-xl text-sm font-semibold hover:bg-[#a32555] active:scale-[0.98] transition-all shadow-md shadow-[#be3168]/15"
          >
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200 gap-4">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 pb-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "products"
              ? "border-[#be3168] text-[#be3168]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Package size={16} /> Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 pb-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "categories"
              ? "border-[#be3168] text-[#be3168]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <FolderTree size={16} /> Categories ({categories.length})
        </button>
      </div>

      {/* Products Tab View */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Filters Bar */}
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#be3168]"
              />
            </div>
            
            {/* Category Select */}
            <div className="w-full md:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-10 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#be3168]"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="p-4 pl-6">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Featured</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/40 transition-colors">
                      {/* Image */}
                      <td className="p-4 pl-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-gray-100">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                          ) : (
                            <Tag size={16} className="text-gray-300" />
                          )}
                        </div>
                      </td>
                      {/* Name */}
                      <td className="p-4 font-semibold text-gray-900">{p.name}</td>
                      {/* Category */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium text-xs">
                          {p.category.name}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="p-4 font-medium text-gray-900">
                        {formatPrice(p.price)}
                        <span className="text-xs text-gray-400 font-normal"> / {p.priceUnit}</span>
                      </td>
                      {/* Featured */}
                      <td className="p-4 text-center">
                        {p.featured ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FFD400]/10 text-yellow-600">
                            <Star size={14} fill="currentColor" />
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      {/* Status */}
                      <td className="p-4 text-center">
                        {p.status === "active" ? (
                          <span className="px-2.5 py-0.5 bg-green-50 text-green-600 rounded-full font-medium text-xs inline-flex items-center gap-1">
                            <Check size={10} /> Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-gray-50 text-gray-400 rounded-full font-medium text-xs inline-flex items-center gap-1">
                            <X size={10} /> Draft
                          </span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link
                            href={`/admin/products/edit/${p.id}`}
                            className="p-2 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-lg hover:shadow-sm transition-all"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            disabled={deletingId === p.id}
                            className="p-2 text-red-500 hover:text-white hover:bg-red-500 border border-gray-200 hover:border-red-500 rounded-lg hover:shadow-sm disabled:opacity-50 transition-all"
                          >
                            {deletingId === p.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Categories Tab View */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FolderTree className="text-gray-400" size={18} /> Active Categories
            </h3>
            <div className="divide-y divide-gray-100">
              {categories.map((c) => (
                <div key={c.id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                  <div>
                    <h4 className="font-semibold text-gray-900">{c.name}</h4>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">slug: {c.slug}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 font-medium">
                      {c._count?.products || 0} products
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="p-2 text-red-500 hover:text-white hover:bg-red-500 border border-gray-100 hover:border-red-500 rounded-lg hover:shadow-sm transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Category Form Panel (Slide out or card layout) */}
          {(showAddCat || categories.length === 0) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-bold text-gray-900">Add New Category</h3>
                <button onClick={() => setShowAddCat(false)} className="text-gray-400 hover:text-gray-600 lg:hidden">
                  <X size={18} />
                </button>
              </div>
              
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sound System"
                    value={newCatName}
                    onChange={(e) => handleCatNameChange(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#be3168]"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., sound-system"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#be3168] font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingCat || !newCatName}
                  className="w-full flex items-center justify-center h-10 bg-[#be3168] hover:bg-[#a32555] text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {isSubmittingCat ? <Loader2 size={16} className="animate-spin" /> : "Save Category"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
