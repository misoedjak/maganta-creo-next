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
  Quote,
  Upload,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { 
  createClient, 
  updateClient, 
  deleteClient, 
  reorderClients 
} from "@/app/actions/clients";

interface ClientItem {
  id: string;
  name: string;
  logoUrl: string;
  order: number;
  event?: string | null;
  type?: string | null;
  feedback?: string | null;
  stat?: string | null;
  createdAt: Date;
}

interface ClientsClientProps {
  initialClients: ClientItem[];
}

export function ClientsClient({ initialClients }: ClientsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form Fields & Upload states
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [event, setEvent] = useState("");
  const [type, setType] = useState("");
  const [feedback, setFeedback] = useState("");
  const [stat, setStat] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);

  // Filter clients
  const filteredClients = initialClients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        const errData = await res.json();
        throw new Error(errData.error || "Failed to upload logo image");
      }

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        setLogoUrl(data.urls[0]);
        toast.success("Logo uploaded successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload logo image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !logoUrl) {
      toast.error("Please provide client name and upload a logo image");
      return;
    }

    startTransition(async () => {
      try {
        const nextOrder = initialClients.length > 0 
          ? Math.max(...initialClients.map(c => c.order)) + 1 
          : 0;

        await createClient({ 
          name, 
          logoUrl, 
          order: nextOrder,
          event: event || null,
          type: type || null,
          feedback: feedback || null,
          stat: stat || null
        });
        
        toast.success("Client added successfully!");
        setIsAddOpen(false);
        resetForm();
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to add client");
      }
    });
  };

  const handleEditOpen = (c: ClientItem) => {
    setSelectedClient(c);
    setName(c.name);
    setLogoUrl(c.logoUrl);
    setEvent(c.event || "");
    setType(c.type || "");
    setFeedback(c.feedback || "");
    setStat(c.stat || "");
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !name || !logoUrl) return;

    startTransition(async () => {
      try {
        await updateClient(selectedClient.id, { 
          name, 
          logoUrl, 
          order: selectedClient.order,
          event: event || null,
          type: type || null,
          feedback: feedback || null,
          stat: stat || null
        });
        
        toast.success("Client updated successfully!");
        setIsEditOpen(false);
        resetForm();
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to update client");
      }
    });
  };

  const handleDeleteOpen = (c: ClientItem) => {
    setSelectedClient(c);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedClient) return;

    startTransition(async () => {
      try {
        await deleteClient(selectedClient.id);
        toast.success("Client deleted successfully!");
        setIsDeleteOpen(false);
        setSelectedClient(null);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete client");
      }
    });
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredClients.length) return;

    startTransition(async () => {
      try {
        const items = [...filteredClients];
        
        // Swap orders
        const tempOrder = items[index].order;
        items[index].order = items[targetIndex].order;
        items[targetIndex].order = tempOrder;

        const payload = [
          { id: items[index].id, order: items[index].order },
          { id: items[targetIndex].id, order: items[targetIndex].order }
        ];

        await reorderClients(payload);
        toast.success("Order updated!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to reorder clients");
      }
    });
  };

  const resetForm = () => {
    setName("");
    setLogoUrl("");
    setEvent("");
    setType("");
    setFeedback("");
    setStat("");
    setSelectedClient(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Search and Action Row */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Input 
            placeholder="Search clients..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
          <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <Button 
          onClick={() => setIsAddOpen(true)} 
          className="bg-brand-magenta hover:bg-brand-magenta/90 text-white flex items-center gap-1.5 shrink-0"
        >
          <Plus size={16} />
          <span>Add Client</span>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Sort</TableHead>
              <TableHead className="w-48">Logo Preview</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Testimonial Event</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-400 text-sm">
                  No clients found. Click &quot;Add Client&quot; to create one!
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client, idx) => (
                <TableRow key={client.id}>
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
                        disabled={idx === filteredClients.length - 1 || isPending}
                        onClick={() => handleMove(idx, "down")}
                        className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded transition-colors"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </TableCell>
                  
                  {/* Logo Preview */}
                  <TableCell>
                    <div className="bg-zinc-50 border border-gray-100 rounded-lg p-2 h-14 flex items-center justify-center min-w-[120px]">
                      <img 
                        src={client.logoUrl} 
                        alt={client.name}
                        className="max-h-full max-w-full object-contain filter hover:brightness-90 transition-all"
                      />
                    </div>
                  </TableCell>

                  {/* Name */}
                  <TableCell className="font-semibold text-gray-900">{client.name}</TableCell>
                  
                  {/* Testimonial Event Info */}
                  <TableCell className="text-gray-500 font-light text-sm">
                    {client.feedback ? (
                      <span className="flex items-center gap-1.5 text-zinc-700">
                        <Quote size={12} className="text-brand-magenta" />
                        <span className="font-medium">{client.event || "General Testimony"}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Logo Only</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEditOpen(client)}
                      disabled={isPending}
                      className="h-8 w-8 hover:text-brand-magenta"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDeleteOpen(client)}
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
      <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if(!open) resetForm(); }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Client</DialogTitle>
            <DialogDescription>Add a new corporate partner logo and optional project showcase feedback.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            
            <div className="space-y-1.5">
              <Label htmlFor="name">Client Name *</Label>
              <Input 
                id="name" 
                placeholder="e.g. Bank Mandiri" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            {/* Logo Upload Field */}
            <div className="space-y-1.5 border border-gray-100 rounded-lg p-3 bg-zinc-50/50">
              <Label>Client Logo Image *</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="h-16 w-32 border border-gray-200 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain p-1" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 text-gray-700 font-semibold cursor-pointer text-xs transition-colors">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                      <span>Uploading Logo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5 text-gray-500" />
                      <span>Choose Logo File</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            {/* Testimonial Section */}
            <div className="border-t border-gray-100 pt-4 mt-2">
              <h4 className="font-semibold text-sm text-gray-800 mb-3">Project Showcase Testimony (Optional)</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="space-y-1.5">
                  <Label htmlFor="event">Event Name</Label>
                  <Input 
                    id="event" 
                    placeholder="e.g. GIIAS Motor Show 2025" 
                    value={event} 
                    onChange={(e) => setEvent(e.target.value)} 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="type">Fabrication Type</Label>
                  <Input 
                    id="type" 
                    placeholder="e.g. Custom Double-Deck Booth" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="space-y-1.5">
                  <Label htmlFor="stat">Key Achievement / Stat</Label>
                  <Input 
                    id="stat" 
                    placeholder="e.g. Zero-defect finish / 36-hour build" 
                    value={stat} 
                    onChange={(e) => setStat(e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="feedback">Feedback Quote</Label>
                <textarea 
                  id="feedback" 
                  rows={2}
                  placeholder="Enter the client feedback quote narrative..." 
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)} 
                  className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-magenta"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending || isUploading} className="bg-brand-magenta text-white hover:bg-brand-magenta/90">
                Create Client
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if(!open) resetForm(); }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Modify client credentials, logo, and testimonial details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Client Name *</Label>
              <Input 
                id="edit-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            {/* Logo Upload Field */}
            <div className="space-y-1.5 border border-gray-100 rounded-lg p-3 bg-zinc-50/50">
              <Label>Client Logo Image *</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="h-16 w-32 border border-gray-200 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain p-1" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 text-gray-700 font-semibold cursor-pointer text-xs transition-colors">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                      <span>Uploading Logo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5 text-gray-500" />
                      <span>Change Logo File</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            {/* Testimonial Section */}
            <div className="border-t border-gray-100 pt-4 mt-2">
              <h4 className="font-semibold text-sm text-gray-800 mb-3">Project Showcase Testimony (Optional)</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-event">Event Name</Label>
                  <Input 
                    id="edit-event" 
                    value={event} 
                    onChange={(e) => setEvent(e.target.value)} 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-type">Fabrication Type</Label>
                  <Input 
                    id="edit-type" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-stat">Key Achievement / Stat</Label>
                  <Input 
                    id="edit-stat" 
                    value={stat} 
                    onChange={(e) => setStat(e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-feedback">Feedback Quote</Label>
                <textarea 
                  id="edit-feedback" 
                  rows={2}
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)} 
                  className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-magenta"
                />
              </div>
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
            <DialogTitle className="text-red-600">Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedClient?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteSubmit} disabled={isPending}>
              Delete Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
