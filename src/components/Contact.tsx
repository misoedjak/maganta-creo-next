"use client";

import React, { useState, useTransition, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  Mail, 
  FileText, 
  MapPin, 
  Loader2, 
  Phone,
  MessageSquare,
  RefreshCw
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitQuoteRequest } from "@/app/actions/public";
import { useSearchParams } from "next/navigation";

interface ContactProps {
  profile?: {
    email: string | null;
    phone: string | null;
    phoneName: string | null;
    phone2: string | null;
    phone2Name: string | null;
    address: string | null;
    mapUrl: string | null;
    whatsapp: string | null;
    whatsappName: string | null;
    whatsapp2: string | null;
    whatsapp2Name: string | null;
  } | null;
  categories?: {
    id: string;
    name: string;
  }[];
  selectedEventId?: string;
}

export default function Contact({ profile, categories, selectedEventId }: ContactProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  
  const searchParams = useSearchParams();
  const quoteParam = searchParams.get("quote");

  // Form states
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("");
  const [customEventType, setCustomEventType] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  // Handle selectedEventId navigation to auto-open and pre-select category
  useEffect(() => {
    if (selectedEventId && categories) {
      const found = categories.find(c => c.id === selectedEventId);
      if (found) {
        setEventType(found.name);
        setIsCustom(false);
        setCustomEventType("");
        setIsOpen(true);
      }
    }
  }, [selectedEventId, categories]);

  // Handle ?quote=open query parameter
  useEffect(() => {
    if (quoteParam === "open") {
      setIsOpen(true);
      // Clean up URL so refreshing doesn't keep it open
      if (typeof window !== "undefined") {
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState(null, "", newUrl);
      }
    }
  }, [quoteParam]);

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
        setIsOpen(false);
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

  const formattedWhatsapp = profile?.whatsapp 
    ? (() => {
        let clean = profile.whatsapp.replace(/[^0-9]/g, "");
        if (clean.startsWith("0")) {
          clean = "62" + clean.substring(1);
        }
        return `https://wa.me/${clean}`;
      })()
    : "https://wa.me/6281234567890";

  return (
    <section id="contact" className="py-16 md:py-24 bg-brand-magenta text-white relative" suppressHydrationWarning>
      <div className="container mx-auto px-6 md:px-12" suppressHydrationWarning>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* CTA Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-8 text-white">
              Let&apos;s Build Your Next Event Together.
            </h2>
            <p className="text-xl font-medium text-white/80 mb-10 max-w-lg">
              Get in touch with our team today to discuss your event fabrication needs, budget scope, and request a detailed quotation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center" suppressHydrationWarning>
              <a
                href={formattedWhatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-yellow text-black font-semibold hover:bg-white transition-colors shadow-lg shadow-black/10"
              >
                <MessageCircle size={20} /> WhatsApp
              </a>
              <a
                href={`mailto:${profile?.email || "hello@magantakreasi.com"}`}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-brand-magenta transition-colors"
              >
                <Mail size={20} /> Email
              </a>

              {/* Request Quotation Dialog Trigger */}
              <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-brand-magenta transition-colors"
              >
                <FileText size={20} /> Request Quotation
              </button>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                          {categories?.map((cat) => (
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
                          className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-magenta"
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
                          setIsOpen(false);
                          resetForm();
                        }}
                        disabled={isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-brand-yellow text-black hover:bg-brand-magenta hover:text-white font-semibold flex items-center gap-1.5 transition-all shadow-md"
                      >
                        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        <span>Submit Request</span>
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

            </div>
          </motion.div>

          {/* Map & Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#8a1a45] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-8 pb-6">
              <h3 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                <MapPin className="text-brand-yellow" /> HQ & Workshop
              </h3>
              <p className="text-pink-100/90 mb-2 whitespace-pre-line text-sm leading-relaxed">
                {profile?.address || "Jakarta, Indonesia\nAvailable for nationwide deployment."}
              </p>
            </div>

            {/* Google Maps Embed */}
            <div className="w-full h-64 bg-white/10 relative">
              {(() => {
                let mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a9!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1689255627254!5m2!1sen!2sus";
                if (profile?.mapUrl && profile.mapUrl.includes("embed")) {
                  mapSrc = profile.mapUrl;
                } else if (profile?.address) {
                  mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(profile.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                }
                return (
                  <>
                    <iframe 
                      key={mapKey}
                      src={mapSrc} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(1.1) opacity(0.85)" }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <button
                      type="button"
                      onClick={() => setMapKey(prev => prev + 1)}
                      className="absolute top-2 left-[142px] z-10 h-[34px] px-3 rounded-sm bg-[#1a1a1a] border border-[#2c2c2c] flex items-center gap-1.5 text-xs font-bold text-[#e8e8e8] hover:text-white transition-all shadow-md active:scale-95 hover:bg-[#2a2a2a]"
                      title="Recenter Map"
                    >
                      <RefreshCw size={11} className="shrink-0 text-brand-yellow" />
                      <span>Recenter</span>
                    </button>
                  </>
                );
              })()}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
