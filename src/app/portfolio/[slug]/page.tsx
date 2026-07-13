import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Building2, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const revalidate = 0;

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug }
  });

  if (!portfolio) return {};

  return {
    title: portfolio.seoTitle || `${portfolio.title} | Maganta Kreasi`,
    description: portfolio.seoDesc || portfolio.description.substring(0, 160),
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!portfolio || portfolio.status !== "published") {
    notFound();
  }

  // Compile all images: thumbnail + gallery
  const allImages = [portfolio.thumbnail];
  portfolio.images.forEach(img => {
    if (img.url !== portfolio.thumbnail) {
      allImages.push(img.url);
    }
  });

  const profile = await prisma.companyProfile.findFirst();

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark font-sans selection:bg-[#FFD400] selection:text-black">
      <Navbar />

      {/* Top Padding for fixed Navbar */}
      <div className="pt-24 pb-12 md:pt-32">
        <div className="container mx-auto px-6 md:px-12">
          
          {/* Back Button */}
          <Link 
            href="/#portfolio" 
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-brand-magenta transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Showcase</span>
          </Link>

          {/* Hero Banner Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side: Images Showcase */}
            <div className="lg:col-span-7 space-y-6">
              <div className="w-full aspect-[16/10] bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl">
                <img 
                  src={portfolio.thumbnail} 
                  alt={portfolio.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gallery Images List */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {allImages.slice(1).map((url, idx) => (
                    <a 
                      key={idx} 
                      href={url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="aspect-video bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 hover:border-brand-magenta/50 transition-colors group block"
                    >
                      <img 
                        src={url} 
                        alt={`Gallery ${idx}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right side: Project Profile Specs */}
            <div className="lg:col-span-5 space-y-8 bg-white border border-brand-magenta/10 rounded-3xl p-8 shadow-lg">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-magenta text-white uppercase tracking-wider shadow-md shadow-brand-magenta/10">
                  <Tag className="h-3 w-3" />
                  <span>{portfolio.category.name}</span>
                </span>
                <h1 className="font-heading text-3xl md:text-4xl font-bold leading-tight text-brand-dark">
                  {portfolio.title}
                </h1>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-1 gap-5 border-y border-zinc-200 py-6 text-sm">
                {portfolio.client && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-brand-magenta shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Client Name</p>
                      <p className="font-semibold text-zinc-800 mt-0.5">{portfolio.client}</p>
                    </div>
                  </div>
                )}
                {portfolio.projectDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-brand-magenta shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Date Completed</p>
                      <p className="font-semibold text-zinc-800 mt-0.5">
                        {new Date(portfolio.projectDate).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {portfolio.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-brand-magenta shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Venue Location</p>
                      <p className="font-semibold text-zinc-800 mt-0.5">{portfolio.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description Body */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Project Narrative</h4>
                <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line font-light">
                  {portfolio.description}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer profile={profile} />
    </div>
  );
}
