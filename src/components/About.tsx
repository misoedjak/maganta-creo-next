"use client";

import { CheckCircle2 } from "lucide-react";

interface AboutProps {
  settings?: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
    features: string;
  } | null;
  stats?: {
    id: string;
    number: string;
    label: string;
  }[] | null;
}

export default function About({ settings, stats }: AboutProps) {
  const headingRaw = settings?.heading || "Dedikasi untuk {Kualitas & Presisi}";
  const heading = headingRaw.includes("{") && headingRaw.includes("}")
    ? headingRaw.replace(/\{([^}]+)\}/g, '<span class="text-brand-magenta font-bold whitespace-nowrap">$1</span>')
    : headingRaw.includes("Kualitas & Presisi")
      ? headingRaw.replace("Kualitas & Presisi", '<span class="text-brand-magenta font-bold whitespace-nowrap">Kualitas & Presisi</span>')
      : headingRaw;
  const paragraph1 = settings?.paragraph1 || "Maganta Kreasi adalah spesialis fabrikasi dan dekorasi event premier di Indonesia. Kami mewujudkan desain event visioner dengan integritas struktural dan kesempurnaan estetika.";
  const paragraph2 = settings?.paragraph2 || "Beroperasi dari workshop in-house kami yang luas, tim kami membuat booth pameran custom, panggung festival monumental, dan lingkungan event korporat yang imersif.";
  
  const featureList = settings?.features
    ? settings.features.split(",").map(item => item.trim()).filter(Boolean)
    : ["Workshop Fabrikasi In-house", "Material Struktural Premium", "Manajer Proyek Terdedikasi"];

  const statCards = stats && stats.length > 0 ? stats : [
    { id: "s1", number: "500+", label: "Fabrikasi Selesai" },
    { id: "s2", number: "Top", label: "Klien Korporat" },
    { id: "s3", number: "In-House", label: "Workshop Produksi" },
    { id: "s4", number: "100%", label: "Layanan Nasional" },
  ];

  return (
    <section id="about" className="py-12 md:py-24 bg-brand-light relative overflow-hidden z-10">
      {/* Background abstract brush stroke shape */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-100 select-none">
        <svg
          className="absolute w-[140%] h-[140%] -top-[20%] -left-[20%] min-w-[1000px]"
          viewBox="0 0 1000 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Primary Thick Stroke */}
          <path
            d="M-50,550 C200,420 350,120 650,280 C850,390 1000,200 1100,50 C950,220 850,520 650,450 C450,380 150,680 -50,550 Z"
            fill="#FFD400"
          />
          {/* Secondary dry-brush stroke */}
          <path
            d="M50,580 Q320,490 620,410 T950,260"
            stroke="#FFD400"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="20 15 5 15"
            opacity="0.6"
          />
          {/* Paint Splatters & Drips */}
          <circle cx="280" cy="180" r="14" fill="#FFD400" opacity="0.8" />
          <circle cx="315" cy="155" r="7" fill="#FFD400" opacity="0.65" />
          <circle cx="250" cy="210" r="5" fill="#FFD400" opacity="0.5" />
          
          <circle cx="780" cy="400" r="12" fill="#FFD400" opacity="0.8" />
          <circle cx="745" cy="425" r="6" fill="#FFD400" opacity="0.6" />
          
          <circle cx="120" cy="460" r="10" fill="#FFD400" opacity="0.75" />
          
          {/* Paint drip shape */}
          <path
            d="M480,310 Q495,305 488,335 Q480,345 478,325 Z"
            fill="#FFD400"
            opacity="0.85"
          />
          <path
            d="M820,360 Q830,355 825,380 Z"
            fill="#FFD400"
            opacity="0.75"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div className="transition-all duration-300">
            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold mb-6 text-zinc-900 leading-[1.15]" dangerouslySetInnerHTML={{ __html: heading }} />
            <div className="space-y-6 text-zinc-800 font-semibold text-xs sm:text-sm md:text-base leading-relaxed">
              <p>{paragraph1}</p>
              <p>{paragraph2}</p>
              
              <ul className="space-y-3 pt-4">
                {featureList.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-800">
                    <CheckCircle2 className="text-brand-magenta" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Stats Grid */}
          <div className="grid grid-cols-2 gap-6 lg:pb-8">
            {statCards.map((stat, idx) => (
              <div 
                key={stat.id} 
                className="p-5 md:p-8 flex flex-col items-center justify-center text-center rounded-2xl bg-brand-magenta border border-brand-magenta/30 shadow-md hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-magenta/20 transition-all duration-300"
              >
                <span className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-brand-yellow text-glow-yellow mb-2">
                  {stat.number}
                </span>
                <span className="text-xs md:text-sm uppercase tracking-wider text-white/90 font-bold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
