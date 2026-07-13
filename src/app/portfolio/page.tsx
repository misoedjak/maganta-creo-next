import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Portfolio from "@/components/Portfolio";
import { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Project Portfolio Catalogue | Maganta Kreasi",
    description: "Browse all custom exhibition booths, stage fabrications, backdrop setups, and decorative installations completed by Maganta Kreasi.",
  };
}

export default async function PortfolioCataloguePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const portfolios = await prisma.portfolio.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { id: true, name: true }
      },
      images: {
        orderBy: { order: "asc" }
      }
    }
  });

  const profile = await prisma.companyProfile.findFirst();

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark font-sans selection:bg-[#FFD400] selection:text-black">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-white to-brand-light relative overflow-hidden border-b border-brand-magenta/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-magenta/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 tracking-tight text-brand-dark">
            Fabrication <span className="text-brand-magenta">Portfolio</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Browse our full catalog of custom booths, monumental stages, and decorative visual installations.
          </p>
        </div>
      </section>

      {/* Mounting the reusable dynamic grid component */}
      <div className="pb-16">
        <Portfolio initialPortfolios={portfolios} categories={categories} />
      </div>

      <Footer profile={profile} />
    </div>
  );
}
