"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceUnit: string;
  description: string | null;
  image: string | null;
  featured: boolean;
  status: string;
  categoryId: string;
  category: {
    name: string;
  };
}

interface FeaturedProductsProps {
  products: Product[];
  whatsappNumber: string;
}

export default function FeaturedProducts({ products, whatsappNumber }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace("IDR", "Rp");
  };

  const handleInquiry = (productName: string, priceStr: string) => {
    let cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "62" + cleanNumber.substring(1);
    }
    const message = encodeURIComponent(`Halo Maganta Kreasi, saya tertarik untuk menyewa/memesan produk berikut:\n\n*Produk:* ${productName}\n*Harga:* ${priceStr}\n\nMohon info ketersediaan untuk event saya. Terima kasih!`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  };

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
    <section className="py-8 lg:py-16 bg-white relative overflow-hidden border-t border-brand-magenta/5">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-magenta/5 rounded-full filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD400]/5 rounded-full filter blur-3xl opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 lg:mb-8 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-magenta/5 border border-brand-magenta/10 text-brand-magenta text-xs font-bold uppercase tracking-wider mb-4">
              <Tag size={12} /> Rental Peralatan Event
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
              Penyewaan Alat & <span className="text-brand-magenta relative inline-block text-glow-magenta font-bold">
                Pendukung Event
                <span className="absolute bottom-1 left-0 w-full h-1.5 bg-[#FFD400] -z-10 rounded-full opacity-80" />
              </span>
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm md:text-base leading-relaxed mt-3 font-medium max-w-xl">
              Lengkapi kebutuhan acara Anda dengan peralatan berkualitas premium. Tersedia sistem pencahayaan (lighting), panggung, sound system, dan pendukung fabrikasi lainnya.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#be3168] hover:text-[#a32555] group shrink-0 transition-colors"
          >
            Lihat Semua Katalog <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group/slider">
          {/* Products Swipeable Track */}
          <div 
            ref={scrollRef}
            className="flex items-stretch gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:-mx-12 md:px-12 lg:mx-0 lg:px-0 scroll-pl-6 md:scroll-pl-12 lg:scroll-pl-0 scrollbar-none"
          >
            {products.map((product, idx) => {
              const formattedPrice = `${formatPrice(product.price)} / ${product.priceUnit}`;
              return (
                <div 
                  key={product.id} 
                  className="min-w-[75vw] sm:min-w-[45vw] lg:min-w-[calc(25%-18px)] lg:max-w-[calc(25%-18px)] snap-start snap-always shrink-0 flex w-full"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-magenta/10 hover:border-[#be3168]/20 transition-all duration-300 flex flex-col w-full"
                  >
                    {/* Image container */}
                    <div className="relative aspect-video w-full bg-gray-50 overflow-hidden flex items-center justify-center shrink-0 border-b border-gray-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-300 gap-1.5">
                          <Tag size={16} />
                          <span className="text-[10px]">Tidak Ada Gambar</span>
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-2 left-2 bg-[#FFD400] text-black font-semibold text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                          Terpopuler
                        </div>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="p-3 sm:p-4 flex flex-col flex-grow">
                      <span className="text-[9px] font-bold text-brand-magenta tracking-wider uppercase mb-0.5 block">
                        {product.category.name}
                      </span>
                      <h3 className="font-heading font-bold text-zinc-900 group-hover:text-brand-magenta transition-colors mb-2.5 line-clamp-1 text-xs sm:text-sm md:text-base">
                        {product.name}
                      </h3>

                      {/* Price and Action (Horizontal Side-by-Side) */}
                      <div className="pt-2.5 border-t border-zinc-100 mt-auto flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[9px] text-zinc-400 block font-semibold leading-none mb-0.5">Harga Sewa</span>
                          <span className="text-brand-magenta font-bold text-xs sm:text-sm truncate block">
                            {formatPrice(product.price)}
                            <span className="text-[9px] text-zinc-500 font-normal">/{product.priceUnit}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => handleInquiry(product.name, formattedPrice)}
                          className="flex-shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25D366] text-white font-semibold text-[10px] sm:text-xs hover:bg-[#20ba56] active:scale-95 transition-all"
                        >
                          <MessageSquare size={11} className="shrink-0" />
                          <span>Sewa</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 border border-zinc-200 text-zinc-800 flex items-center justify-center shadow-md hover:bg-brand-magenta hover:text-white hover:border-brand-magenta active:scale-95 transition-all opacity-0 group-hover/slider:opacity-100 hidden md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 border border-zinc-200 text-zinc-800 flex items-center justify-center shadow-md hover:bg-brand-magenta hover:text-white hover:border-brand-magenta active:scale-95 transition-all opacity-0 group-hover/slider:opacity-100 hidden md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Swipe Indicator (Mobile Only) */}
        <div className="flex md:hidden items-center justify-center gap-1.5 mt-2 text-zinc-400 text-xs font-light">
          <span>← Geser untuk melihat lainnya →</span>
        </div>
      </div>
    </section>
  );
}
