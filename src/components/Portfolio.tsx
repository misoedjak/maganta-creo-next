"use client";

import { useState } from "react";
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
  categories: { id: string; name: string }[];
}

export default function Portfolio({ initialPortfolios, categories }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All" 
    ? initialPortfolios 
    : initialPortfolios.filter(p => p.categoryId === activeFilter);

  return (
    <section id="portfolio" className="py-24 bg-brand-light border-t border-brand-magenta/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-brand-dark">Our Portfolios</h2>
            <p className="text-zinc-500 text-lg max-w-xl">
              Explore our recent event fabrication, custom exhibition booths, backdrops, and decorations.
            </p>
          </motion.div>

          {/* Categories Filters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveFilter("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === "All" 
                  ? "bg-brand-magenta text-white shadow-md shadow-brand-magenta/15" 
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === cat.id 
                    ? "bg-brand-magenta text-white shadow-md shadow-brand-magenta/15" 
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Portfolios Display */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 flex flex-col items-center gap-2 border border-dashed border-zinc-200 rounded-2xl">
            <FolderOpen className="h-8 w-8 text-zinc-400" />
            <p className="text-sm">No showcase projects published in this category yet.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map(project => (
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
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[#FFD400] font-medium text-sm mb-2">{project.category.name}</span>
                      <h3 className="font-heading text-2xl font-bold text-white mb-2">{project.title}</h3>
                      {project.client && <p className="text-xs text-white/50 mb-2">Client: {project.client}</p>}
                      
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4">
                        <ArrowUpRight size={20} className="text-white" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
