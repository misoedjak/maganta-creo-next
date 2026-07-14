"use client";

import { motion } from "framer-motion";
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
  const heading = settings?.heading || "Dedikasi untuk Kualitas & Presisi";
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
    <section id="about" className="pt-24 pb-16 bg-brand-light relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-brand-dark" dangerouslySetInnerHTML={{ __html: heading }} />
            <div className="space-y-6 text-zinc-600 text-lg leading-relaxed">
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
          </motion.div>

          {/* Right Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {statCards.map((stat) => (
              <div key={stat.id} className="glass-card p-5 md:p-8 flex flex-col items-center justify-center text-center group hover:bg-brand-magenta/5 hover:-translate-y-1 transition-all duration-300">
                <span className="font-heading text-4xl md:text-5xl font-bold text-brand-magenta mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </span>
                <span className="text-xs md:text-sm uppercase tracking-wider text-zinc-500 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
