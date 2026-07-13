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
  Upload,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { 
  createPipelineStep, 
  updatePipelineStep, 
  deletePipelineStep, 
  reorderPipelineSteps 
} from "@/app/actions/pipeline";

interface PipelineStepItem {
  id: string;
  title: string;
  description: string;
  bgImageUrl?: string | null;
  order: number;
  createdAt: Date;
}

interface PipelineClientProps {
  initialSteps: PipelineStepItem[];
}

export function PipelineClient({ initialSteps }: PipelineClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedStep, setSelectedStep] = useState<PipelineStepItem | null>(null);

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
    if (!title || !description) return;

    startTransition(async () => {
      try {
        const nextOrder = initialSteps.length > 0 
          ? Math.max(...initialSteps.map(s => s.order)) + 1 
          : 0;

        await createPipelineStep({ 
          title, 
          description, 
          bgImageUrl: bgImageUrl || null,
          order: nextOrder 
        });
        toast.success("Pipeline step added successfully!");
        setIsAddOpen(false);
        setTitle("");
        setDescription("");
        setBgImageUrl("");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to add step");
      }
    });
  };

  const handleEditOpen = (step: PipelineStepItem) => {
    setSelectedStep(step);
    setTitle(step.title);
    setDescription(step.description);
    setBgImageUrl(step.bgImageUrl || "");
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStep || !title || !description) return;

    startTransition(async () => {
      try {
        await updatePipelineStep(selectedStep.id, { 
          title, 
          description, 
          bgImageUrl: bgImageUrl || null,
          order: selectedStep.order 
        });
        toast.success("Pipeline step updated successfully!");
        setIsEditOpen(false);
        setSelectedStep(null);
        setTitle("");
        setDescription("");
        setBgImageUrl("");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to update step");
      }
    });
  };

  const handleDeleteOpen = (step: PipelineStepItem) => {
    setSelectedStep(step);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedStep) return;

    startTransition(async () => {
      try {
        await deletePipelineStep(selectedStep.id);
        toast.success("Pipeline step deleted successfully!");
        setIsDeleteOpen(false);
        setSelectedStep(null);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete step");
      }
    });
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= initialSteps.length) return;

    startTransition(async () => {
      try {
        const items = [...initialSteps];
        
        // Swap orders
        const tempOrder = items[index].order;
        items[index].order = items[targetIndex].order;
        items[targetIndex].order = tempOrder;

        const payload = [
          { id: items[index].id, order: items[index].order },
          { id: items[targetIndex].id, order: items[targetIndex].order }
        ];

        await reorderPipelineSteps(payload);
        toast.success("Order updated!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to reorder steps");
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Search and Action Row */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Pipeline Steps</h3>
        <Button 
          onClick={() => {
            setTitle("");
            setDescription("");
            setBgImageUrl("");
            setIsAddOpen(true);
          }} 
          className="bg-brand-magenta hover:bg-brand-magenta/90 text-white flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Add Step</span>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Sort</TableHead>
              <TableHead className="w-20">Step #</TableHead>
              <TableHead className="w-20">Preview</TableHead>
              <TableHead className="w-64">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialSteps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                  No pipeline steps found. Click &quot;Add Step&quot; to create one!
                </TableCell>
              </TableRow>
            ) : (
              initialSteps.map((step, idx) => (
                <TableRow key={step.id}>
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
                        disabled={idx === initialSteps.length - 1 || isPending}
                        onClick={() => handleMove(idx, "down")}
                        className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded transition-colors"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </TableCell>
                  
                  {/* Step Number Badge */}
                  <TableCell>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-magenta/10 text-brand-magenta text-xs font-bold font-heading">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                  </TableCell>

                  {/* Photo Preview */}
                  <TableCell>
                    <div className="w-12 h-8 rounded border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                      {step.bgImageUrl ? (
                        <img src={step.bgImageUrl} alt={step.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={14} className="text-gray-300" />
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Title */}
                  <TableCell className="font-semibold text-gray-900">{step.title}</TableCell>
                  
                  {/* Description */}
                  <TableCell className="text-gray-500 font-light text-sm max-w-md truncate">
                    {step.description}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEditOpen(step)}
                      disabled={isPending}
                      className="h-8 w-8 hover:text-brand-magenta"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDeleteOpen(step)}
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
            <DialogTitle>Add Pipeline Step</DialogTitle>
            <DialogDescription>Create a new process step for the Fabrication Pipeline timeline.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2 max-h-[65vh] overflow-y-auto px-1">
            <div className="space-y-1.5">
              <Label htmlFor="title">Step Title *</Label>
              <Input 
                id="title" 
                placeholder="e.g. Consultation & Briefing" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
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
              <Label htmlFor="description">Description *</Label>
              <textarea 
                id="description" 
                rows={3}
                placeholder="Describe what occurs during this event fabrication step..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-magenta"
                required 
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending || isUploading} className="bg-brand-magenta text-white hover:bg-brand-magenta/90">
                Create Step
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md bg-white text-gray-900 rounded-2xl border-none shadow-xl">
          <DialogHeader>
            <DialogTitle>Edit Pipeline Step</DialogTitle>
            <DialogDescription>Modify pipeline step details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2 max-h-[65vh] overflow-y-auto px-1">
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">Step Title *</Label>
              <Input 
                id="edit-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
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
            <DialogTitle className="text-red-600">Delete Step</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedStep?.title}&quot;? This action will remove it from the timeline sequence.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteSubmit} disabled={isPending}>
              Delete Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
