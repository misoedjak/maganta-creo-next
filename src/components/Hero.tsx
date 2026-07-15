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
  const headingRaw = settings?.heading || "Vendor Booth Pameran & <br class=\"hidden md:block\" /> <span class=\"text-brand-yellow whitespace-nowrap\">Kontraktor Event</span> Premium.";
  const heading = headingRaw.includes("{") && headingRaw.includes("}")
    ? headingRaw.replace(/\{([^}]+)\}/g, '<span class="text-brand-yellow font-bold whitespace-nowrap">$1</span>')
    : headingRaw;
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
            className="hidden lg:col-span-5 lg:flex flex-col gap-6 p-8 rounded-3xl bg-gradient-to-br from-brand-magenta via-[#9e2150] to-[#7c153d] border border-white/20 shadow-2xl relative overflow-hidden group shadow-brand-magenta/35 animate-in fade-in duration-700"
          >
            {/* Glossy gradient overlays & glass reflections */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none -z-10 group-hover:bg-white/15 transition-all duration-500" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-brand-yellow shadow-[0_0_8px_#FFD400] animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest text-brand-yellow font-extrabold">Highlight Perusahaan</span>
              </span>
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight mt-1">
              Kontraktor & Fabrikasi <br />Event Terpercaya
            </h3>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex flex-col hover:bg-white/15 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden shadow-inner">
                {/* Micro accent */}
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-yellow/40" />
                <span className="font-heading text-3xl font-extrabold text-brand-yellow tracking-tight drop-shadow-sm">500+</span>
                <span className="text-[10px] text-pink-100/90 font-bold uppercase tracking-wider mt-1.5">Project Selesai</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex flex-col hover:bg-white/15 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden shadow-inner">
                {/* Micro accent */}
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-yellow/40" />
                <span className="font-heading text-3xl font-extrabold text-brand-yellow tracking-tight drop-shadow-sm">100%</span>
                <span className="text-[10px] text-pink-100/90 font-bold uppercase tracking-wider mt-1.5">In-house Fabric</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-white/15 text-xs text-white/90">
              <div className="flex items-center gap-3 group/item">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center group-hover/item:bg-brand-yellow/20 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                </span>
                <span className="font-medium">Workshop In-House Pribadi Seluas 2000m²</span>
              </div>
              <div className="flex items-center gap-3 group/item">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center group-hover/item:bg-brand-yellow/20 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                </span>
                <span className="font-medium">Pengiriman & Pemasangan Seluruh Indonesia</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
