import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Handshake, Award, Quote, CheckCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Klien & Mitra Kami | Maganta Kreasi",
    description: "Temukan brand, perusahaan, dan penyelenggara acara yang mempercayakan layanan fabrikasi premium kepada Maganta Kreasi.",
  };
}

export default async function ClientsPage() {
  const profile = await prisma.companyProfile.findFirst();
  const dbClients = await prisma.client.findMany({
    orderBy: { order: "asc" },
  });
  const clientPortfolios = await prisma.portfolio.findMany({
    where: { status: "published" },
    select: { client: true, slug: true },
  });

  const fallbackLogos = [
    { name: "Bank Mandiri", logoUrl: "/uploads/logos/bank_mandiri.svg" },
    { name: "BCA", logoUrl: "/uploads/logos/bca.svg" },
    { name: "Pertamina", logoUrl: "/uploads/logos/pertamina.svg" },
    { name: "Telkomsel", logoUrl: "/uploads/logos/telkomsel.svg" },
    { name: "Hyundai", logoUrl: "/uploads/logos/hyundai.svg" },
    { name: "Honda Prospect", logoUrl: "/uploads/logos/honda_prospect.svg" },
    { name: "Astra International", logoUrl: "/uploads/logos/astra_international.svg" },
    { name: "BSI", logoUrl: "/uploads/logos/bsi.svg" },
    { name: "Sampoerna", logoUrl: "/uploads/logos/sampoerna.svg" },
    { name: "Sinarmas Land", logoUrl: "/uploads/logos/sinarmas_land.svg" },
    { name: "XL Axiata", logoUrl: "/uploads/logos/xl_axiata.svg" },
    { name: "PTBA", logoUrl: "/uploads/logos/ptba.svg" }
  ];

  const logosToRender = dbClients.length > 0
    ? dbClients.map(c => {
        const match = clientPortfolios.find(p => p.client?.toLowerCase() === c.name.toLowerCase());
        return {
          name: c.name,
          logoUrl: c.logoUrl,
          portfolioSlug: match ? match.slug : null
        };
      })
    : fallbackLogos.map(l => ({ ...l, portfolioSlug: null }));

  const fallbackCaseStudies = [
    {
      client: "Bank Mandiri",
      event: "BUMN Expo 2025",
      type: "Custom Double-Deck Booth",
      feedback: "Maganta Kreasi delivered an outstanding double-deck structure that was both structurally sound and visually striking. Their workshop capabilities allowed for adjustments during design refinement.",
      stat: "10,000+ Visitors"
    },
    {
      client: "Telkomsel",
      event: "Digital Lifestyle Award 2025",
      type: "Monumental Entrance Gate & Stage",
      feedback: "The RGB illumination integration and CNC precision mapping on the entrance gates were flawless. They finished assembly 4 hours before the strict security lock-down.",
      stat: "36-hour build"
    },
    {
      client: "Hyundai Indonesia",
      event: "GIIAS Motor Show 2025",
      type: "Exhibition Backdrop & Totems",
      feedback: "Clean visual joints, anti-glare matte coating, and perfect branding color matching. Highly recommended for automotive booths where finishes are inspected closely.",
      stat: "Zero-defect finish"
    }
  ];

  const dbCaseStudies = dbClients.filter(c => c.feedback && c.feedback.trim() !== "");
  const caseStudiesToRender = dbCaseStudies.length > 0
    ? dbCaseStudies.map(c => ({
        client: c.name,
        event: c.event || "Corporate Event",
        type: c.type || "Custom Fabrication",
        feedback: c.feedback!,
        stat: c.stat || "Premium Quality"
      }))
    : fallbackCaseStudies;

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark font-sans selection:bg-[#FFD400] selection:text-black">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-white to-brand-light relative overflow-hidden border-b border-brand-magenta/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-magenta/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 tracking-tight text-brand-dark">
            Our <span className="text-brand-magenta">Clients</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            We build long-term trust by delivering high-end structural fabrications for Indonesia&apos;s leading brands.
          </p>
        </div>
      </section>

      {/* Partner Logos Grid */}
      <section className="py-16 bg-brand-light">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-dark">Trusted Nationwide</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {logosToRender.map((client, i) => {
              const cardContent = (
                <div 
                  className="flex items-center justify-center p-4 hover:scale-105 transition-all duration-300 cursor-pointer h-36"
                >
                  <div data-impeccable-variants="43eeccf9" data-impeccable-variant-count="3" style={{ display: "contents" }}>
                    {/* impeccable-variants-start 43eeccf9 */}
                    {/* Original */}
                    <div data-impeccable-variant="original">
                      <img 
                        src={`${client.logoUrl}?v=2`} 
                        alt={client.name} 
                        className="max-h-16 md:max-h-20 max-w-[180px] md:max-w-[220px] object-contain opacity-95 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    {/* Variants: insert below this line */}
                    <style data-impeccable-css="43eeccf9">{`
                      @scope ([data-impeccable-variant="1"]) {
                        :scope img {
                          max-height: 5.5rem !important; /* ~88px */
                          max-width: 220px !important;
                        }
                      }
                      @scope ([data-impeccable-variant="2"]) {
                        :scope img {
                          max-height: 7rem !important; /* ~112px */
                          max-width: 260px !important;
                        }
                      }
                      @scope ([data-impeccable-variant="3"]) {
                        :scope img {
                          max-height: 8.5rem !important; /* ~136px */
                          max-width: 300px !important;
                        }
                      }
                    `}</style>
                    <div data-impeccable-variant="1">
                      <img 
                        src={`${client.logoUrl}?v=2`} 
                        alt={client.name} 
                        className="max-h-20 max-w-[200px] object-contain opacity-95 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div data-impeccable-variant="2" style={{ display: "none" }}>
                      <img 
                        src={`${client.logoUrl}?v=2`} 
                        alt={client.name} 
                        className="max-h-28 max-w-[240px] object-contain opacity-95 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div data-impeccable-variant="3" style={{ display: "none" }}>
                      <img 
                        src={`${client.logoUrl}?v=2`} 
                        alt={client.name} 
                        className="max-h-36 max-w-[280px] object-contain opacity-95 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    {/* impeccable-variants-end 43eeccf9 */}
                  </div>
                </div>
              );

              if (client.portfolioSlug) {
                return (
                  <Link key={i} href={`/portfolio/${client.portfolioSlug}`}>
                    {cardContent}
                  </Link>
                );
              }

              return <div key={i}>{cardContent}</div>;
            })}
          </div>
        </div>
      </section>

      {/* Case Studies / Feedback */}
      <section className="py-24 bg-zinc-50 border-t border-brand-magenta/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold mb-4 flex items-center justify-center gap-2 text-brand-dark">
              <Award className="text-brand-magenta h-8 w-8" />
              <span>Project Showcases</span>
            </h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto font-light">
              See what our corporate partners say about our workshop production standards and deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudiesToRender.map((caseStudy, idx) => (
              <div 
                key={idx} 
                className="glass-card p-8 bg-white border border-brand-magenta/10 rounded-3xl relative overflow-hidden group hover:border-brand-magenta/40 transition-colors flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div className="space-y-6">
                  {/* Client name & event */}
                  <div>
                    <span className="text-[10px] font-bold text-brand-magenta uppercase tracking-widest block">
                      {caseStudy.type}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-brand-dark mt-1">
                      {caseStudy.client}
                    </h3>
                    <p className="text-xs text-zinc-500 font-light mt-0.5">{caseStudy.event}</p>
                  </div>

                  {/* Feedback quote */}
                  <div className="relative text-sm text-zinc-600 leading-relaxed font-light italic pl-6">
                    <Quote className="absolute left-0 top-0 h-4.5 w-4.5 text-brand-magenta opacity-40" />
                    <p>{caseStudy.feedback}</p>
                  </div>
                </div>

                {/* Highlight Stat */}
                <div className="pt-6 mt-6 border-t border-brand-magenta/5 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 uppercase tracking-widest font-semibold">Key Achievement</span>
                  <span className="font-bold text-brand-magenta bg-brand-magenta/10 px-2.5 py-1 rounded-full">{caseStudy.stat}</span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer profile={profile} />
    </div>
  );
}
