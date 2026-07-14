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
        <div className="max-w-4xl">
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
            className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4"
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
      </div>
    </section>
  );
}
