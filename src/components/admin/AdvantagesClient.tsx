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
  Edit2, 
  Trash2,
  ArrowUp,
  ArrowDown,
  Hammer,
  ShieldCheck,
  PenTool,
  Clock,
  Map,
  Drill,
  Award,
  Palette,
  Settings,
  Sparkles,
  Upload,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { 
  createAdvantage, 
  updateAdvantage, 
  deleteAdvantage, 
  reorderAdvantages 
} from "@/app/actions/advantages";

interface AdvantageItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgImageUrl?: string | null;
  order: number;
  createdAt: Date;
}

interface AdvantagesClientProps {
  initialAdvantages: AdvantageItem[];
}

export const availableIcons = [
  "Hammer",
  "ShieldCheck",
  "PenTool",
  "Clock",
  "Map",
  "Drill",
  "Award",
  "Palette",
  "Settings",
  "Sparkles"
];

export function getIconComponent(name: string, size = 16) {
  switch (name) {
    case "Hammer": return <Hammer size={size} />;
    case "ShieldCheck": return <ShieldCheck size={size} />;
    case "PenTool": return <PenTool size={size} />;
    case "Clock": return <Clock size={size} />;
    case "Map": return <Map size={size} />;
    case "Drill": return <Drill size={size} />;
    case "Award": return <Award size={size} />;
    case "Palette": return <Palette size={size} />;
    case "Settings": return <Settings size={size} />;
    case "Sparkles": return <Sparkles size={size} />;
    default: return <Hammer size={size} />;
  }
}

export function AdvantagesClient({ initialAdvantages }: AdvantagesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Hammer");
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAdvantage, setSelectedAdvantage] = useState<AdvantageItem | null>(null);

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
    if (!title || !description || !icon) return;

    startTransition(async () => {
      try {
        const nextOrder = initialAdvantages.length > 0 
          ? Math.max(...initialAdvantages.map(a => a.order)) + 1 
          : 0;

        await createAdvantage({ 
          title, 
          description, 
          icon, 
          bgImageUrl: bgImageUrl || null,
          order: nextOrder 
        });
        toast.success("Advantage added successfully!");
        setIsAddOpen(false);
        setTitle("");
        setDescription("");
        setIcon("Hammer");
        setBgImageUrl("");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to add advantage");
      }
    });
  };

  const handleEditOpen = (adv: AdvantageItem) => {
    setSelectedAdvantage(adv);
    setTitle(adv.title);
    setDescription(adv.description);
    setIcon(adv.icon);
    setBgImageUrl(adv.bgImageUrl || "");
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvantage || !title || !description || !icon) return;

    startTransition(async () => {
      try {
        await updateAdvantage(selectedAdvantage.id, { 
          title, 
          description, 
          icon, 
          bgImageUrl: bgImageUrl || null,
          order: selectedAdvantage.order 
        });
        toast.success("Advantage updated successfully!");
        setIsEditOpen(false);
        setSelectedAdvantage(null);
        setTitle("");
        setDescription("");
        setIcon("Hammer");
        setBgImageUrl("");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to update advantage");
      }
    });
  };

  const handleDeleteOpen = (adv: AdvantageItem) => {
    setSelectedAdvantage(adv);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedAdvantage) return;

    startTransition(async () => {
      try {
        await deleteAdvantage(selectedAdvantage.id);
        toast.success("Advantage deleted successfully!");
        setIsDeleteOpen(false);
        setSelectedAdvantage(null);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete advantage");
      }
    });
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= initialAdvantages.length) return;

    startTransition(async () => {
      try {
        const items = [...initialAdvantages];
        
        // Swap orders
        const tempOrder = items[index].order;
        items[index].order = items[targetIndex].order;
        items[targetIndex].order = tempOrder;

        const payload = [
          { id: items[index].id, order: items[index].order },
          { id: items[targetIndex].id, order: items[targetIndex].order }
        ];

        await reorderAdvantages(payload);
        toast.success("Order updated!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to reorder items");
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Search and Action Row */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Advantages List</h3>
        <Button 
          onClick={() => {
            setTitle("");
            setDescription("");
            setIcon("Hammer");
            setBgImageUrl("");
            setIsAddOpen(true);
          }} 
          className="bg-brand-magenta hover:bg-brand-magenta/90 text-white flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Add Advantage</span>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Sort</TableHead>
              <TableHead className="w-16">Preview</TableHead>
              <TableHead className="w-16">Icon</TableHead>
              <TableHead className="w-64">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialAdvantages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                  No advantages found. Click &quot;Add Advantage&quot; to create one!
                </TableCell>
              </TableRow>
            ) : (
              initialAdvantages.map((adv, idx) => (
                <TableRow key={adv.id}>
                  {/* Reordering */}
                  <TableCell>
                    <div className="flex flex-col gap-1 items-center">
                      <button 
                        disabled={idx === 0 || isPending}
                        onClick={() => handleMove(idx, "up")}
                        className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded transition-colors"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        disabled={idx === initialAdvantages.length - 1 || isPending}
                        onClick={() => handleMove(idx, "down")}
                        className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded transition-colors"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </TableCell>

                  {/* Photo Preview */}
                  <TableCell>
                    <div className="w-12 h-8 rounded border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                      {adv.bgImageUrl ? (
                        <img src={adv.bgImageUrl} alt={adv.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={14} className="text-gray-300" />
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Icon */}
                  <TableCell>
                    <div className="w-9 h-9 rounded-lg bg-brand-magenta/10 text-brand-magenta flex items-center justify-center">
                      {getIconComponent(adv.icon, 18)}
                    </div>
                  </TableCell>

                  {/* Title */}
                  <TableCell className="font-semibold text-gray-900">{adv.title}</TableCell>
                  
                  {/* Description */}
                  <TableCell className="text-gray-500 font-light text-sm max-w-md truncate">
                    {adv.description}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEditOpen(adv)}
                      disabled={isPending}
                      className="h-8 w-8 hover:text-brand-magenta"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDeleteOpen(adv)}
                      disabled={isPending}
                      className="h-8 w-8 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                    >
                      <Trash2 size={14} />
                    </Button>
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
          <DialogHeader>
            <DialogTitle>Add Advantage</DialogTitle>
            <DialogDescription>Create a new card for the Maganta Advantage grid.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2 max-h-[65vh] overflow-y-auto px-1">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                placeholder="e.g. In-House Workshop" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="icon">Lucide Icon *</Label>
              <select 
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              >
                {availableIcons.map(ic => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
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
              <Label htmlFor="description">Description *</Label>
              <textarea 
                id="description" 
                rows={3}
                placeholder="Enter description text..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-magenta"
                required 
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending || isUploading} className="bg-brand-magenta text-white hover:bg-brand-magenta/90">
                Create Advantage
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md bg-white text-gray-900 rounded-2xl border-none shadow-xl">
          <DialogHeader>
            <DialogTitle>Edit Advantage</DialogTitle>
            <DialogDescription>Modify advantages detail content properties.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2 max-h-[65vh] overflow-y-auto px-1">
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">Title *</Label>
              <Input 
                id="edit-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-icon">Lucide Icon *</Label>
              <select 
                id="edit-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              >
                {availableIcons.map(ic => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
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
              <Label htmlFor="edit-description">Description *</Label>
              <textarea 
                id="edit-description" 
                rows={3}
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-magenta"
                required 
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending || isUploading} className="bg-brand-magenta text-white hover:bg-brand-magenta/90">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Advantage</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedAdvantage?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteSubmit} disabled={isPending}>
              Delete Advantage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
