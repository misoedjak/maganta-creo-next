"use client";

import { motion } from "framer-motion";
import { Tent, LayoutTemplate, DoorOpen, MapPin, Palette, Hammer, Frame, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bgImageUrl?: string | null;
}

interface ServicesProps {
  categories?: CategoryItem[];
}

function getCategoryIcon(slug: string) {
  const lower = slug.toLowerCase();
  if (lower.includes("booth")) return <Tent size={32} />;
  if (lower.includes("stage") || lower.includes("panggung")) return <LayoutTemplate size={32} />;
  if (lower.includes("backdrop") || lower.includes("dekorasi")) return <Frame size={32} />;
  if (lower.includes("gate") || lower.includes("gerbang")) return <DoorOpen size={32} />;
  if (lower.includes("sign") || lower.includes("totem") || lower.includes("direction")) return <MapPin size={32} />;
  return <Palette size={32} />;
}

export default function Services({ categories = [] }: ServicesProps) {
  return (
    <section id="services" className="py-16 md:py-24 bg-brand-light relative border-t border-brand-magenta/5" suppressHydrationWarning>
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark">Layanan Kami</h2>
            <a
              href="/services"
              className="px-5 py-2.5 text-sm font-semibold rounded-full bg-brand-magenta text-white hover:bg-brand-yellow hover:text-black hover:scale-105 transition-transform shadow-lg shadow-brand-magenta/10 inline-flex items-center gap-2"
            >
              Pesan Layanan
            </a>
          </div>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Solusi Fabrikasi Event Menyeluruh. Kami membangun fondasi fisik untuk kesuksesan event Anda.
          </p>
        </motion.div>

        {categories.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-sm border border-dashed border-zinc-200 rounded-3xl">
            Belum ada layanan fabrikasi. Buat kategori di dashboard admin!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, i) => {
              const hasBg = !!category.bgImageUrl;

              return (
                <Link key={category.id} href={`/portfolio?category=${category.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={classNameHelper(hasBg)}
                  >
                    {hasBg ? (
                      <>
                        {/* Background Image Card view */}
                        <div className="absolute inset-0 z-0">
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                          <img 
                            src={category.bgImageUrl!} 
                            alt={category.name} 
                            className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-20 flex flex-col h-full justify-end">
                          <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-brand-yellow">
                            {getCategoryIcon(category.slug)}
                          </div>
                          <span className="font-semibold text-xs tracking-wider uppercase mb-1.5 text-brand-yellow">
                            Layanan
                          </span>
                          <h3 className="font-heading text-2xl font-bold mb-2 text-white">{category.name}</h3>
                          {category.description && (
                            <p className="text-white/80 leading-relaxed text-sm font-light line-clamp-2 mb-4">
                              {category.description}
                            </p>
                          )}
                          <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-brand-yellow group-hover:text-black group-hover:border-brand-yellow transition-all duration-300">
                            <ArrowUpRight size={16} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Standard Card view */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-magenta/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-magenta/10 transition-colors" />
                        
                        <div className="relative z-10">
                          <div className="w-16 h-16 rounded-full bg-brand-magenta/10 flex items-center justify-center text-brand-magenta mb-6 group-hover:scale-110 transition-transform">
                            {getCategoryIcon(category.slug)}
                          </div>
                          <h3 className="font-heading text-2xl font-bold mb-3 text-brand-dark">{category.name}</h3>
                          {category.description && (
                            <p className="text-zinc-600 leading-relaxed text-sm font-light">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function classNameHelper(hasBg: boolean) {
  if (hasBg) {
    return "relative overflow-hidden group h-[26rem] rounded-3xl border border-brand-magenta/10 shadow-lg cursor-pointer flex flex-col justify-end p-8";
  }
  return "glass-card p-8 relative overflow-hidden group hover:border-brand-magenta/40 transition-colors";
}
