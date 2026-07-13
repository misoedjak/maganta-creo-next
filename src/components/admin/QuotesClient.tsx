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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Search, 
  Eye, 
  Trash2, 
  Calendar,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  Building2,
  Trash,
  Users
} from "lucide-react";
import { updateQuoteStatus, deleteQuote } from "@/app/actions/admin";

interface QuoteItem {
  id: string;
  company: string | null;
  contact: string;
  phone: string;
  email: string;
  eventType: string | null;
  location: string | null;
  eventDate: Date | null;
  budget: string | null;
  description: string;
  status: string;
  createdAt: Date;
}

interface QuotesClientProps {
  initialQuotes: QuoteItem[];
}

const statusOptions = ["NEW", "CONTACTED", "QUOTED", "CLOSED"];

export function QuotesClient({ initialQuotes }: QuotesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dialog states
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Filter computation
  const filteredQuotes = initialQuotes.filter(quote => {
    const matchesSearch = 
      quote.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quote.company && quote.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      quote.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedQuote) return;

    startTransition(async () => {
      try {
        await updateQuoteStatus(selectedQuote.id, newStatus);
        setSelectedQuote({ ...selectedQuote, status: newStatus });
        toast.success(`Quote status updated to ${newStatus}`);
        router.refresh();
      } catch (err: any) {
        toast.error("Failed to update status");
      }
    });
  };

  const handleDeleteSubmit = async () => {
    if (!selectedQuote) return;

    startTransition(async () => {
      try {
        await deleteQuote(selectedQuote.id);
        toast.success("Quote request deleted successfully!");
        setIsDeleteOpen(false);
        setSelectedQuote(null);
        router.refresh();
      } catch (err: any) {
        toast.error("Failed to delete quote request");
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
            placeholder="Search contacts, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-gray-200"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Label htmlFor="status-filter" className="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">Filter By Status:</Label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 border border-gray-200 bg-white rounded-xl px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
          >
            <option value="ALL">All Statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-100">
              <TableHead className="font-semibold text-gray-700 py-4 pl-6">Contact / Company</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">Event Details</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">Date Submitted</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                  No quote requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotes.map((quote) => (
                <TableRow key={quote.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                  <TableCell className="py-4 pl-6">
                    <div className="font-medium text-gray-900">{quote.contact}</div>
                    <div className="text-xs text-gray-500">{quote.company || "No Company"}</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-sm text-gray-900">{quote.eventType || "General Event"}</div>
                    <div className="text-xs text-gray-500">
                      {quote.location || "No Location Specified"}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 py-4">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      quote.status === "NEW" ? "bg-blue-100 text-blue-800" :
                      quote.status === "CONTACTED" ? "bg-amber-100 text-amber-800" :
                      quote.status === "QUOTED" ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {quote.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedQuote(quote);
                          setIsViewOpen(true);
                        }}
                        className="h-8 border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Open</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        onClick={() => {
                          setSelectedQuote(quote);
                          setIsDeleteOpen(true);
                        }}
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

      {/* View Detail Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl bg-white text-gray-900 rounded-2xl border-none shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              <span>Brief Details</span>
            </DialogTitle>
            <DialogDescription>
              Submitted on {selectedQuote && new Date(selectedQuote.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-6 py-4">
              {/* Status Manager */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lead Status</p>
                  <p className="text-xs text-gray-500 mt-0.5">Manage this quote's workflow stage.</p>
                </div>
                <select
                  value={selectedQuote.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isPending}
                  className="h-10 border border-gray-200 bg-white rounded-xl px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Card */}
                <div className="space-y-3.5">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Contact Information</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2.5 text-gray-700">
                      <Users className="h-4 w-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedQuote.contact}</p>
                        {selectedQuote.company && <p className="text-xs text-gray-500">{selectedQuote.company}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                      <a href={`tel:${selectedQuote.phone}`} className="hover:underline text-gray-900">{selectedQuote.phone}</a>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-700">
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      <a href={`mailto:${selectedQuote.email}`} className="hover:underline text-gray-900">{selectedQuote.email}</a>
                    </div>
                  </div>
                </div>

                {/* Event Details Card */}
                <div className="space-y-3.5 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Event Requirements</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2.5 text-gray-700">
                      <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Event Type</p>
                        <p className="font-medium text-gray-900">{selectedQuote.eventType || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Event Date</p>
                        <p className="font-medium text-gray-900">
                          {selectedQuote.eventDate ? new Date(selectedQuote.eventDate).toLocaleDateString() : "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="font-medium text-gray-900">{selectedQuote.location || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-700">
                      <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Est. Budget</p>
                        <p className="font-medium text-gray-900">{selectedQuote.budget || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Description */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Project Brief & Description</h3>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm leading-relaxed text-gray-700 max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {selectedQuote.description}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsViewOpen(false)}
              className="border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-white text-gray-900 rounded-2xl border-none shadow-xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-bold text-red-600 flex items-center gap-2">
              <Trash className="h-5 w-5" />
              <span>Delete Quote Request</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the request from <strong>{selectedQuote?.contact}</strong>? This action cannot be undone.
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
