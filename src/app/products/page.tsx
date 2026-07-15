import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsList from "@/components/ProductsList";
import { Package, Tag } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Katalog Produk & Peralatan Sewa | Maganta Kreasi",
    description: "Telusuri inventaris peralatan sewa event premium kami termasuk pencahayaan panggung profesional, sound system, truss, dan rigging.",
  };
}

export default async function ProductsPage() {
  const profile = await prisma.companyProfile.findFirst();
  const rawProducts = await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: { name: "asc" }
  });
  
  const categories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" }
  });

  // Safe fallback WhatsApp number
  const whatsappNumber = profile?.whatsapp || profile?.phone || "6282115151515";

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark font-sans selection:bg-[#FFD400] selection:text-black">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-white to-brand-light relative overflow-hidden border-b border-brand-magenta/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#be3168]/10 text-[#be3168] text-xs font-semibold uppercase tracking-wider mb-4">
              <Package size={12} /> Equipment Rental
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-brand-magenta leading-tight mb-4">
              Premium Event <span className="text-[#FFD400] bg-[#be3168] px-3 py-1 rounded-lg">Catalog</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl">
              Professional-grade event equipment inventory ready for lease. Find lighting setups, sound systems, and custom staging structures for events of any size.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="pt-6 pb-16 bg-brand-light">
        <div className="container mx-auto px-6 md:px-12">
          <ProductsList 
            products={rawProducts} 
            categories={categories} 
            whatsappNumber={whatsappNumber} 
          />
        </div>
      </section>

      <Footer profile={profile} />
    </div>
  );
}
