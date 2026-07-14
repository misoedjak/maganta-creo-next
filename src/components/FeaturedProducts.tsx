"use client";

import { motion } from "framer-motion";
import { MessageSquare, ArrowRight, Tag } from "lucide-react";
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

  return (
    <section className="pt-16 pb-24 bg-white relative overflow-hidden border-t border-brand-magenta/5">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-magenta/5 rounded-full filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD400]/5 rounded-full filter blur-3xl opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#be3168]/10 text-[#be3168] text-xs font-semibold uppercase tracking-wider mb-4">
              <Tag size={12} /> Rental Peralatan Event
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-brand-magenta leading-tight">
              Penyewaan Alat & <span className="text-brand-magenta relative inline-block">
                Pendukung Event
                <span className="absolute bottom-1 left-0 w-full h-1 bg-[#FFD400] -z-10 rounded-full" />
              </span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-4">
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

        {/* Products Swipeable Track */}
        <div className="flex items-stretch gap-4 md:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:-mx-12 md:px-12 scrollbar-none">
          {products.map((product, idx) => {
            const formattedPrice = `${formatPrice(product.price)} / ${product.priceUnit}`;
            return (
              <div 
                key={product.id} 
                className="min-w-[70vw] sm:min-w-[45vw] lg:min-w-[280px] lg:max-w-[280px] snap-start snap-always shrink-0 flex"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gray-200/60 transition-all duration-300 flex flex-col w-full h-full"
                >
                  {/* Image container */}
                  <div className="relative aspect-[16/10] w-full bg-gray-50 overflow-hidden flex items-center justify-center shrink-0 border-b border-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-300 gap-1.5">
                        <Tag size={20} />
                        <span className="text-[10px]">Tidak Ada Gambar</span>
                      </div>
                    )}
                    {product.featured && (
                      <div className="absolute top-3 left-3 bg-[#FFD400] text-black font-semibold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
                        Terpopuler
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-xs font-bold text-[#be3168] tracking-wider uppercase mb-1.5 block">
                      {product.category.name}
                    </span>
                    <h3 className="font-heading font-bold text-gray-900 group-hover:text-[#be3168] transition-colors mb-2 line-clamp-1 text-base md:text-lg">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-grow">
                      {product.description || "Penyewaan perlengkapan event berkualitas tinggi oleh Maganta Kreasi."}
                    </p>

                    {/* Price and Action */}
                    <div className="pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex flex-col gap-3">
                        <div>
                          <span className="text-xs text-gray-400 block font-semibold">Harga Sewa</span>
                          <span className="text-[#be3168] font-bold text-base md:text-lg">
                            {formatPrice(product.price)}
                            <span className="text-xs text-gray-500 font-normal"> / {product.priceUnit}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => handleInquiry(product.name, formattedPrice)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20ba56] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#25D366]/10 transition-all duration-200"
                        >
                          <MessageSquare size={16} /> Sewa Sekarang
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
