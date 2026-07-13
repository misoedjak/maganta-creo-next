import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesList from "@/components/ServicesList";
import { Hammer } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Services & Capabilities | Maganta Kreasi",
    description: "Detailed exhibition booth fabrication, stage setups, backdrops, gates, wayfinding, and artistic decorative installations by Maganta Kreasi.",
  };
}

export default async function ServicesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const profile = await prisma.companyProfile.findFirst();

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark font-sans selection:bg-[#FFD400] selection:text-black">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-white to-brand-light relative overflow-hidden border-b border-brand-magenta/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-magenta/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 tracking-tight text-brand-dark">
            Fabrication <span className="text-brand-magenta">Capabilities</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            From raw blueprints to structural masterpieces. Explore our comprehensive list of event production capabilities.
          </p>
        </div>
      </section>

      {/* Services Detail List */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-12">
          <ServicesList categories={categories} />
        </div>
      </section>

      {/* Workshop Intro */}
      <section className="py-24 bg-zinc-50 border-t border-brand-magenta/5 text-center text-brand-dark">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl space-y-6">
          <Hammer className="h-10 w-10 text-brand-magenta mx-auto animate-pulse" />
          <h2 className="font-heading text-3xl font-bold text-brand-dark">Have A Custom Concept In Mind?</h2>
          <p className="text-zinc-600 font-light text-sm leading-relaxed">
            Our engineers and visual designers can customize structure profiles, material selections, and lighting to match your exact concept blueprints. Get in touch with our team to kickstart negotiations.
          </p>
          <div className="pt-4">
            <Link href="/#contact">
              <span className="px-8 py-3.5 rounded-full bg-brand-yellow hover:bg-brand-magenta hover:text-white text-black font-semibold text-sm transition-all cursor-pointer inline-block shadow-md">
                Start Consultation
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer profile={profile} />
    </div>
  );
}
