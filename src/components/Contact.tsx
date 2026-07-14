"use client";

import React, { useState, useTransition, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  Mail, 
  FileText, 
  MapPin, 
  Loader2, 
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
    <section id="contact" className="py-12 md:py-24 bg-brand-magenta text-white relative" suppressHydrationWarning>
      <div className="container mx-auto px-6 md:px-12" suppressHydrationWarning>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* CTA Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-2xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 text-white">
              Mari Bangun Event Anda Bersama Kami.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/80 mb-8 max-w-lg">
              Hubungi tim kami hari ini untuk mendiskusikan kebutuhan fabrikasi event Anda, anggaran, dan meminta penawaran detail.
            </p>
            
            <div className="w-full flex flex-col sm:flex-row gap-4 items-center" suppressHydrationWarning>
              <a
                href={formattedWhatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-brand-yellow text-black font-semibold text-sm sm:text-base hover:bg-white transition-colors shadow-lg shadow-black/10"
              >
                <MessageCircle size={20} /> WhatsApp
              </a>
              <a
                href={`mailto:${profile?.email || "hello@magantakreasi.com"}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-transparent border-2 border-white text-white font-semibold text-sm sm:text-base hover:bg-white hover:text-brand-magenta transition-colors"
              >
                <Mail size={20} /> Email
              </a>

              {/* Request Quotation Dialog Trigger */}
              <button 
                onClick={() => setIsOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-transparent border-2 border-white text-white font-semibold text-sm sm:text-base hover:bg-white hover:text-brand-magenta transition-colors"
              >
                <FileText size={20} /> Minta Penawaran
              </button>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-white text-gray-900 rounded-2xl border-none shadow-xl sm:max-w-4xl sm:p-6">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#FFD400]" />
                        <span>Minta Penawaran Event</span>
                      </DialogTitle>
                      <DialogDescription>
                        Isi detail proyek Anda di bawah ini, dan tim fabrikasi kami akan menyiapkan proposal terstruktur.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 py-6 max-h-[65vh] overflow-y-auto px-2">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="q-contact">Nama Narahubung *</Label>
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
                        <Label htmlFor="q-company">Nama Perusahaan</Label>
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
                        <Label htmlFor="q-phone">Nomor WhatsApp/Telepon *</Label>
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
                        <Label htmlFor="q-email">Email Perusahaan *</Label>
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
                        <Label htmlFor="q-type">Jenis Event *</Label>
                        <select
                          id="q-type"
                          value={isCustom ? "CUSTOM" : (eventType || "")}
                          onChange={(e) => handleSelectChange(e.target.value)}
                          disabled={isPending}
                          required
                          className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="" disabled>Pilih jenis event...</option>
                          {categories?.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                          <option value="CUSTOM">Custom (Ketik manual)</option>
                        </select>
                      </div>

                      {isCustom && (
                        <div className="space-y-1.5 md:col-span-2">
                          <Label htmlFor="q-custom-type">Sebutkan Jenis Event Custom *</Label>
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
                        <Label htmlFor="q-date">Tanggal Event</Label>
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
                        <Label htmlFor="q-loc">Lokasi Venue</Label>
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
                        <Label htmlFor="q-budget">Estimasi Anggaran</Label>
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
                        <Label htmlFor="q-desc">Brief & Kebutuhan Proyek *</Label>
                        <textarea
                          id="q-desc"
                          rows={4}
                          placeholder="Deskripsikan ukuran, tema desain, preferensi pencahayaan, dan jadwal loading..."
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
                        <span>Kirim Permintaan</span>
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
            <div data-impeccable-variants="033bc5ac" data-impeccable-variant-count="3" style={{ display: "contents" }}>
              {/* impeccable-variants-start 033bc5ac */}
              {/* Original */}
              <div data-impeccable-variant="original">
                <div className="p-8 pb-6">
                  <h3 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                    <MapPin className="text-brand-yellow" /> Kantor & Workshop
                  </h3>
                  <p className="text-pink-100/90 mb-2 whitespace-pre-line text-sm leading-relaxed">
                    {profile?.address || "Jakarta, Indonesia\nMelayani fabrikasi untuk seluruh Indonesia."}
                  </p>
                </div>
              </div>
              {/* Variants: insert below this line */}
              <style data-impeccable-css="033bc5ac">{`
                @scope ([data-impeccable-variant="1"]) {
                  :scope > div {
                    padding: 2rem;
                  }
                }
                @scope ([data-impeccable-variant="2"]) {
                  :scope > div {
                    padding: 2rem;
                    background: linear-gradient(135deg, #8a1a45 0%, #be3168 100%);
                  }
                }
                @scope ([data-impeccable-variant="3"]) {
                  :scope > div {
                    padding: 2.5rem 2rem;
                    border-top: 4px solid #FFD400;
                  }
                }
              `}</style>
              <div data-impeccable-variant="1">
                <div className="p-8 pb-6">
                  <h3 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                    <MapPin className="text-brand-yellow" /> Kantor & Workshop
                  </h3>
                  <p className="text-pink-100/90 mb-2 whitespace-pre-line text-sm leading-relaxed">
                    {(profile?.address || "Jakarta, Indonesia").split(/Phone:/i)[0].trim()}
                  </p>
                </div>
              </div>
              <div data-impeccable-variant="2" style={{ display: "none" }}>
                <div className="p-8 pb-6 rounded-3xl">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 mb-4">
                    <MapPin className="text-brand-yellow" size={20} />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3 text-white">
                    Lokasi Workshop
                  </h3>
                  <p className="text-white/90 whitespace-pre-line text-sm leading-relaxed">
                    {(profile?.address || "Jakarta, Indonesia").split(/Phone:/i)[0].trim()}
                  </p>
                </div>
              </div>
              <div data-impeccable-variant="3" style={{ display: "none" }}>
                <div className="p-8 pb-6">
                  <h3 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                    <MapPin className="text-brand-yellow" /> Kantor & Workshop Utama
                  </h3>
                  <p className="text-pink-100/80 mb-2 whitespace-pre-line text-sm leading-relaxed font-light">
                    {(profile?.address || "Jakarta, Indonesia").split(/Phone:/i)[0].trim()}
                  </p>
                </div>
              </div>
              {/* impeccable-variants-end 033bc5ac */}
            </div>

            {/* Google Maps Embed */}
            <div className="w-full h-64 bg-white/10 relative">
              {(() => {
                let mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a9!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1689255627254!5m2!1sen!2sus";
                if (profile?.mapUrl && profile.mapUrl.includes("embed")) {
                  mapSrc = profile.mapUrl;
                } else if (profile?.address) {
                  const cleanAddrForMap = profile.address.split(/Phone:/i)[0].trim();
                  mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(cleanAddrForMap)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
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
                      title="Tengahkan Peta"
                    >
                      <RefreshCw size={11} className="shrink-0 text-brand-yellow" />
                      <span>Tengahkan</span>
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
