"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import Link from "next/link";

interface PortfolioImage {
  id: string;
  url: string;
  order: number;
}

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  categoryId: string;
  category: { id: string; name: string };
  thumbnail: string;
  featured: boolean;
  images: PortfolioImage[];
}

interface PortfolioProps {
  initialPortfolios: PortfolioItem[];
  categories: { id: string; name: string; slug: string }[];
  layoutMode?: "grid" | "carousel";
}

export default function Portfolio({ initialPortfolios, categories, layoutMode = "grid" }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState("Semua");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get("category");
      if (categoryParam) {
        const match = categories.find(
          c => c.slug.toLowerCase() === categoryParam.toLowerCase() || 
               c.id === categoryParam
        );
        if (match) {
          setActiveFilter(match.id);
          // If on portfolio page, scroll to portfolio container nicely
          const el = document.getElementById("portfolio");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    }
  }, [categories]);

  const filteredProjects = activeFilter === "Semua" 
    ? initialPortfolios 
    : initialPortfolios.filter(p => p.categoryId === activeFilter);

  const projectsToRender = layoutMode === "carousel" 
    ? initialPortfolios.slice(0, 6) // limit to 6 items on homepage carousel
    : filteredProjects;

  return (
    <section id="portfolio" className="py-12 md:py-24 bg-brand-light border-t border-brand-magenta/5 overflow-hidden" suppressHydrationWarning>
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-brand-dark">Portofolio Kami</h2>
            <p className="text-zinc-500 text-sm sm:text-base md:text-lg max-w-xl">
              Jelajahi proyek pameran, booth custom, backdrop, dan dekorasi event terbaru kami.
            </p>
          </motion.div>

          {/* Categories Filters - Only show in grid mode */}
          {layoutMode === "grid" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap scrollbar-none snap-x snap-mandatory shrink-0"
            >
              <button
                onClick={() => setActiveFilter("Semua")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 snap-start ${
                  activeFilter === "Semua" 
                    ? "bg-brand-magenta text-white shadow-md shadow-brand-magenta/15" 
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Semua
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 snap-start ${
                    activeFilter === cat.id 
                      ? "bg-brand-magenta text-white shadow-md shadow-brand-magenta/15" 
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Portfolios Display */}
        {projectsToRender.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 flex flex-col items-center gap-2 border border-dashed border-zinc-200 rounded-2xl">
            <FolderOpen className="h-8 w-8 text-zinc-400" />
            <p className="text-sm">Belum ada proyek portofolio yang dipublikasikan dalam kategori ini.</p>
          </div>
        ) : layoutMode === "carousel" ? (
          /* Carousel layout mode */
          <div className="flex lg:grid lg:grid-cols-3 items-stretch gap-3 md:gap-4 overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:-mx-12 md:px-12 lg:mx-0 lg:px-0 scrollbar-none">
            {projectsToRender.map((project, idx) => (
              <div 
                key={project.id} 
                className="min-w-[75vw] sm:min-w-[40vw] lg:min-w-0 snap-start snap-always shrink-0 lg:shrink flex w-full"
              >
                <Link href={`/portfolio/${project.slug}`} className="group w-full flex flex-col h-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="relative w-full h-full aspect-video rounded-2xl overflow-hidden cursor-pointer bg-black flex flex-col"
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[#FFD400] font-bold text-[10px] sm:text-xs tracking-wider uppercase mb-1">{project.category.name}</span>
                      <h3 className="font-heading text-xs sm:text-base md:text-lg font-bold text-white mb-1 line-clamp-1">{project.title}</h3>
                      {project.client && <p className="text-[9px] sm:text-xs text-white/70 mb-1">Klien: {project.client}</p>}
                      
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 sm:mt-2">
                        <ArrowUpRight size={12} className="text-white" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* Standard Grid Layout */
          <motion.div layout className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            <AnimatePresence>
              {projectsToRender.map(project => (
                <Link href={`/portfolio/${project.slug}`} key={project.id} className="block group">
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-black"
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[#FFD400] font-medium text-[10px] sm:text-sm mb-1 sm:mb-2">{project.category.name}</span>
                      <h3 className="font-heading text-xs sm:text-2xl font-bold text-white mb-1 sm:mb-2 line-clamp-2 leading-tight">{project.title}</h3>
                      {project.client && <p className="text-[9px] sm:text-xs text-white/50 mb-1 sm:mb-2">Klien: {project.client}</p>}
                      
                      <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 sm:mt-4">
                        <ArrowUpRight size={14} className="text-white" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {layoutMode === "carousel" && projectsToRender.length > 0 && (
          <div className="text-center mt-10">
            <Link href="/portfolio">
              <span className="px-8 py-3.5 rounded-full bg-brand-yellow hover:bg-brand-magenta hover:text-white text-black font-semibold text-sm transition-all cursor-pointer inline-block shadow-md">
                Lihat Semua Portofolio
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
