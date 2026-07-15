"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Tent, LayoutTemplate, DoorOpen, MapPin, Palette, Frame, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
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

function getCategoryIcon(slug: string, size = 32) {
  const lower = slug.toLowerCase();
  if (lower.includes("booth")) return <Tent size={size} />;
  if (lower.includes("stage") || lower.includes("panggung")) return <LayoutTemplate size={size} />;
  if (lower.includes("backdrop") || lower.includes("dekorasi")) return <Frame size={size} />;
  if (lower.includes("gate") || lower.includes("gerbang")) return <DoorOpen size={size} />;
  if (lower.includes("sign") || lower.includes("totem") || lower.includes("direction")) return <MapPin size={size} />;
  return <Palette size={size} />;
}

export default function Services({ categories = [] }: ServicesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-12 md:py-24 bg-brand-light relative border-t border-brand-magenta/5 overflow-hidden" suppressHydrationWarning>
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-zinc-900"><span className="text-brand-magenta">Layanan</span> Kami</h2>
          <p className="text-zinc-800 font-semibold text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
            Solusi Fabrikasi Event Menyeluruh. Kami membangun fondasi fisik untuk kesuksesan event Anda.
          </p>
        </motion.div>

        {categories.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 border border-dashed border-zinc-200 rounded-2xl">
            Belum ada layanan fabrikasi. Buat kategori di dashboard admin!
          </div>
        ) : (
          <div className="relative group/slider">
            <div 
              ref={scrollRef}
              className="flex lg:grid lg:grid-cols-3 items-stretch gap-4 md:gap-8 overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:-mx-12 md:px-12 lg:mx-0 lg:px-0 scroll-pl-6 md:scroll-pl-12 lg:scroll-pl-0 scrollbar-none"
            >
              {categories.map((category, i) => {
              const hasBg = !!category.bgImageUrl;

              return (
                <div 
                  key={category.id} 
                  className="min-w-[80vw] sm:min-w-[45vw] lg:min-w-0 snap-start snap-always shrink-0 lg:shrink flex w-full"
                >
                  <Link href={`/portfolio?category=${category.slug}`} className="w-full flex">
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
                            <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-brand-yellow">
                              {getCategoryIcon(category.slug, 20)}
                            </div>
                            <span className="font-semibold text-[10px] sm:text-xs tracking-wider uppercase mb-1.5 text-brand-yellow">
                              Layanan
                            </span>
                            <h3 className="font-heading text-sm sm:text-2xl font-bold mb-1.5 text-white">{category.name}</h3>
                            {category.description && (
                              <p className="text-white/80 leading-relaxed text-xs sm:text-sm font-light line-clamp-2 mb-3">
                                {category.description}
                              </p>
                            )}
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-brand-yellow group-hover:text-black group-hover:border-brand-yellow transition-all duration-300">
                              <ArrowUpRight size={14} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Standard Card view */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-magenta/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-magenta/10 transition-colors" />
                          
                          <div className="relative z-10">
                            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-brand-magenta/10 flex items-center justify-center text-brand-magenta mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                              {getCategoryIcon(category.slug, 20)}
                            </div>
                            <h3 className="font-heading text-sm sm:text-2xl font-bold mb-2 text-brand-dark">{category.name}</h3>
                            {category.description && (
                              <p className="text-zinc-600 leading-relaxed text-xs sm:text-sm font-light line-clamp-2">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </Link>
                </div>
              );
            })}
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-magenta text-white font-semibold hover:bg-[#be3168] hover:scale-105 active:scale-95 transition-all shadow-md shadow-brand-magenta/15"
          >
            Lihat Semua Layanan <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function classNameHelper(hasBg: boolean) {
  if (hasBg) {
    return "relative w-full overflow-hidden group h-full min-h-[16rem] sm:min-h-[26rem] rounded-2xl sm:rounded-3xl border border-brand-magenta/10 shadow-lg hover:shadow-xl hover:shadow-brand-magenta/10 hover:border-[#be3168]/30 hover:-translate-y-2 cursor-pointer flex flex-col justify-end p-4 sm:p-8 transition-all duration-300";
  }
  return "glass-card w-full p-4 sm:p-8 relative overflow-hidden group hover:-translate-y-2 hover:border-[#be3168]/40 hover:shadow-xl hover:shadow-brand-magenta/10 transition-all duration-300 h-full flex flex-col justify-between";
}
