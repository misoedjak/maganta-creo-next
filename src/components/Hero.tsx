"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

interface HeroProps {
  settings?: {
    heading: string;
    subheading: string;
    bgImageUrl: string;
    ctaText: string;
    ctaLink: string;
    portfolioText: string;
    portfolioLink: string;
  } | null;
}

export default function Hero({ settings }: HeroProps) {
  const heading = settings?.heading || "Vendor Booth Pameran & <br class=\"hidden md:block\" /> <span class=\"text-brand-yellow\">Kontraktor Event</span> Premium.";
  const subheading = settings?.subheading || "Solusi fabrikasi dan dekorasi event premium. Dari pembuatan booth pameran custom hingga panggung festival berskala besar.";
  const bgImageUrl = settings?.bgImageUrl || "/uploads/backgrounds/hero-flame-fest.jpg";
  const ctaText = settings?.ctaText || "Konsultasi Sekarang";
  const ctaLink = settings?.ctaLink || "#contact";
  const portfolioText = settings?.portfolioText || "Lihat Portofolio";
  const portfolioLink = settings?.portfolioLink || "#portfolio";

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-16 sm:py-24 md:py-32 bg-white" suppressHydrationWarning>
      {/* Background Image / Video Placeholder */}
      <div 
        className="absolute inset-0 z-0"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="absolute inset-0 bg-black/65 z-10" />
        <motion.img
          src={bgImageUrl}
          alt="Concert Stage"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 0.8 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-20 pb-16 pt-20 sm:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6 text-white drop-shadow-md"
              dangerouslySetInnerHTML={{ __html: heading }}
            />

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xs sm:text-base md:text-lg text-zinc-300 mb-8 sm:mb-10 max-w-2xl leading-relaxed drop-shadow-sm"
            >
              {subheading}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <a
                href={ctaLink}
                className="flex items-center justify-center gap-1.5 px-4 py-3 sm:px-6 sm:py-3 rounded-full bg-brand-yellow text-black font-semibold text-xs sm:text-base hover:bg-white hover:scale-105 transition-all duration-300 shadow-md shadow-brand-yellow/10"
              >
                {ctaText} <ArrowRight size={16} />
              </a>
              <a
                href={portfolioLink}
                className="flex items-center justify-center gap-1.5 px-4 py-3 sm:px-6 sm:py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-xs sm:text-base hover:bg-white/20 transition-all duration-300"
              >
                <Play size={16} /> {portfolioText}
              </a>
            </motion.div>
          </div>

          {/* Right Floating Showcase Box (Desktop Only) */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:col-span-5 lg:flex flex-col gap-6 p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl relative"
          >
            {/* Ambient subtle yellow glow behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-yellow/20 to-brand-magenta/25 rounded-3xl blur-xl opacity-40 pointer-events-none -z-10" />

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-[#FFD400] font-bold">Highlight Perusahaan</span>
            </div>

            <h3 className="font-heading text-lg sm:text-xl font-bold text-white leading-tight">
              Kontraktor & Fabrikasi Event Terpercaya
            </h3>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col">
                <span className="font-heading text-2xl font-bold text-[#FFD400]">500+</span>
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mt-1">Project Selesai</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col">
                <span className="font-heading text-2xl font-bold text-[#FFD400]">100%</span>
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mt-1">In-house Fabric</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-3 border-t border-white/10 text-[11px] text-zinc-300">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                <span>Workshop In-House Pribadi Seluas 2000m²</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                <span>Pengiriman & Pemasangan Seluruh Indonesia</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
