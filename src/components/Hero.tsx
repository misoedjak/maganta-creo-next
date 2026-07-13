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
  const heading = settings?.heading || "Premium Event <br class=\"hidden md:block\" /> <span class=\"text-brand-yellow\">Fabrication</span> & Design.";
  const subheading = settings?.subheading || "Premium Event Fabrication & Decoration Solutions. From Custom Exhibition Booths to Massive Festival Stages.";
  const bgImageUrl = settings?.bgImageUrl || "/uploads/backgrounds/hero-flame-fest.jpg";
  const ctaText = settings?.ctaText || "Get a Quote";
  const ctaLink = settings?.ctaLink || "#contact";
  const portfolioText = settings?.portfolioText || "View Portfolio";
  const portfolioLink = settings?.portfolioLink || "#portfolio";

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-32 bg-white">
      {/* Background Image / Video Placeholder */}
      <div 
        className="absolute inset-0 z-0"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img
          src={bgImageUrl}
          alt="Concert Stage"
          className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-20 pb-16">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white"
            dangerouslySetInnerHTML={{ __html: heading }}
          />

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg text-zinc-300 mb-10 max-w-2xl leading-relaxed"
          >
            {subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href={ctaLink}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-yellow text-black font-semibold text-base hover:bg-white hover:scale-105 transition-all duration-300"
            >
              {ctaText} <ArrowRight size={18} />
            </a>
            <a
              href={portfolioLink}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-all duration-300"
            >
              <Play size={18} /> {portfolioText}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
