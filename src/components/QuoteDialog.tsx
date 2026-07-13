"use client";

import React, { useState, useTransition } from "react";
import { 
  FileText, 
  Loader2 
} from "lucide-react";
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
import { submitQuoteRequest } from "@/app/actions/public";

interface QuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: { id: string; name: string }[];
  preselectedCategory?: string; // category name to auto-select
}

export default function QuoteDialog({ open, onOpenChange, categories, preselectedCategory }: QuoteDialogProps) {
  const [isPending, startTransition] = useTransition();

  // Form states
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState(preselectedCategory || "");
  const [customEventType, setCustomEventType] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  // Sync preselectedCategory when it changes
  React.useEffect(() => {
    if (preselectedCategory) {
      setEventType(preselectedCategory);
      setIsCustom(false);
      setCustomEventType("");
    }
  }, [preselectedCategory]);

  const handleSelectChange = (val: string) => {
    if (val === "CUSTOM") {
      setIsCustom(true);
      setEventType("");
    } else {
      setIsCustom(false);
      setEventType(val);
      setCustomEventType("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact || !phone || !email || !description) {
      toast.error("Please fill in all required fields (Name, Phone, Email, and Brief).");
      return;
    }

    const finalEventType = isCustom ? customEventType : eventType;

    startTransition(async () => {
      try {
        await submitQuoteRequest({
          contact,
          company: company || null,
          phone,
          email,
          eventType: finalEventType || null,
          location: location || null,
          eventDate: eventDate || null,
          budget: budget || null,
          description,
        });

        toast.success("Quote request submitted successfully! We'll get back to you soon.");
        onOpenChange(false);
        resetForm();
      } catch (err: any) {
        toast.error(err.message || "Failed to submit quote request.");
      }
    });
  };

  const resetForm = () => {
    setContact("");
    setCompany("");
    setPhone("");
    setEmail("");
    setEventType("");
    setCustomEventType("");
    setIsCustom(false);
    setLocation("");
    setEventDate("");
    setBudget("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-gray-900 rounded-2xl border-none shadow-xl sm:max-w-4xl sm:p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#FFD400]" />
              <span>Request Event Quotation</span>
            </DialogTitle>
            <DialogDescription>
              Fill out your project parameters below, and our fabrication team will prepare a structured proposal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 py-6 max-h-[65vh] overflow-y-auto px-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="q-contact">Contact Person Name *</Label>
              <Input
                id="q-contact"
                placeholder="e.g. Budi Santoso"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            
            {/* Company */}
            <div className="space-y-1.5">
              <Label htmlFor="q-company">Company Name</Label>
              <Input
                id="q-company"
                placeholder="e.g. PT Maju Bersama"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="q-phone">WhatsApp/Phone Number *</Label>
              <Input
                id="q-phone"
                placeholder="e.g. +62 812-3456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isPending}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="q-email">Corporate Email *</Label>
              <Input
                id="q-email"
                type="email"
                placeholder="e.g. name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
              />
            </div>

            {/* Event Type */}
            <div className="space-y-1.5">
              <Label htmlFor="q-type">Event Type *</Label>
              <select
                id="q-type"
                value={isCustom ? "CUSTOM" : (eventType || "")}
                onChange={(e) => handleSelectChange(e.target.value)}
                disabled={isPending}
                required
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Select event type...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                <option value="CUSTOM">Custom (Type manually)</option>
              </select>
            </div>

            {isCustom && (
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="q-custom-type">Specify Custom Event Type *</Label>
                <Input
                  id="q-custom-type"
                  placeholder="e.g. Virtual Reality Experience, Special Concert Stage"
                  value={customEventType}
                  onChange={(e) => setCustomEventType(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
            )}

            {/* Event Date */}
            <div className="space-y-1.5">
              <Label htmlFor="q-date">Target Event Date</Label>
              <Input
                id="q-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label htmlFor="q-loc">Venue Location</Label>
              <Input
                id="q-loc"
                placeholder="e.g. JCC Senayan, Jakarta"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <Label htmlFor="q-budget">Estimated Budget Range</Label>
              <Input
                id="q-budget"
                placeholder="e.g. IDR 50M - 100M"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Brief */}
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="q-desc">Project Brief & Requirements *</Label>
              <textarea
                id="q-desc"
                rows={4}
                placeholder="Describe sizes, design themes, lighting preferences, and load-in schedules..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#FFD400] text-black hover:bg-[#e6be00] font-semibold flex items-center gap-1.5"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Submit Request</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
