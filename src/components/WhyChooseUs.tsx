"use client";

import { motion } from "framer-motion";
import { Hammer, ShieldCheck, PenTool, Clock, Map, Drill, Award, Palette, Settings, Sparkles, ArrowUpRight } from "lucide-react";

interface AdvantageItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgImageUrl?: string | null;
}

interface WhyChooseUsProps {
  advantages?: AdvantageItem[];
}

function getIcon(name: string, size = 32) {
  switch (name) {
    case "Hammer": return <Hammer size={size} />;
    case "ShieldCheck": return <ShieldCheck size={size} />;
    case "PenTool": return <PenTool size={size} />;
    case "Clock": return <Clock size={size} />;
    case "Map": return <Map size={size} />;
    case "Drill": return <Drill size={size} />;
    case "Award": return <Award size={size} />;
    case "Palette": return <Palette size={size} />;
    case "Settings": return <Settings size={size} />;
    case "Sparkles": return <Sparkles size={size} />;
    default: return <Hammer size={size} />;
  }
}

export default function WhyChooseUs({ advantages = [] }: WhyChooseUsProps) {
  const fallbackFeatures = [
    { title: "Workshop In-House", desc: "Kendali penuh atas kualitas dan ketepatan waktu dengan fasilitas fabrikasi yang lengkap.", icon: "Hammer" },
    { title: "Material Premium", desc: "Kami hanya menggunakan material berkualitas tinggi untuk keamanan struktural dan estetika.", icon: "ShieldCheck" },
    { title: "Prototyping 3D", desc: "Visualisasikan setup Anda sebelum kami membangunnya dengan tim desain 3D ahli kami.", icon: "PenTool" },
    { title: "Teknik Presisi", desc: "Setiap sambungan dan rangka dirancang untuk keamanan beban maksimal.", icon: "Drill" },
    { title: "Pengerjaan Tepat Waktu", desc: "Kepatuhan ketat terhadap jadwal produksi dan waktu loading venue.", icon: "Clock" },
    { title: "Layanan Seluruh Indonesia", desc: "Mampu memproduksi di Jakarta dan memasang di mana saja di seluruh Indonesia.", icon: "Map" },
  ];

  const listToRender = advantages.length > 0 
    ? advantages.map(a => ({ title: a.title, desc: a.description, icon: a.icon, bgImageUrl: a.bgImageUrl }))
    : fallbackFeatures.map(f => ({ ...f, bgImageUrl: null }));

  return (
    <section className="py-12 md:py-24 bg-brand-light relative border-t border-brand-magenta/5" suppressHydrationWarning>
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-brand-dark">Keunggulan Maganta Kreasi</h2>
          <p className="text-zinc-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Kami tidak menggunakan pihak ketiga. Kami membangun sendiri. Inilah mengapa agensi dan brand top mempercayai kami.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {listToRender.map((feature, i) => {
            const hasBg = !!feature.bgImageUrl;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={classNameHelperAdvantage(hasBg)}
              >
                {hasBg ? (
                  <>
                    {/* Background Image Card view */}
                    <div className="absolute inset-0 z-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                      <img 
                        src={feature.bgImageUrl!} 
                        alt={feature.title} 
                        className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-20 flex flex-col h-full justify-end">
                      <div className="absolute top-2 right-2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-brand-yellow">
                        <span className="sm:hidden">{getIcon(feature.icon, 18)}</span>
                        <span className="hidden sm:inline">{getIcon(feature.icon, 24)}</span>
                      </div>
                      <span className="font-semibold text-xs tracking-wider uppercase mb-1.5 text-brand-yellow">
                        Keunggulan
                      </span>
                      <h3 className="font-heading text-xl font-bold mb-2 text-white">{feature.title}</h3>
                      <p className="text-white/80 leading-relaxed text-sm font-light line-clamp-3 mb-4">
                        {feature.desc}
                      </p>
                      <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-brand-yellow group-hover:text-black group-hover:border-brand-yellow transition-all duration-300">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Standard Card view */}
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-brand-magenta/10 flex items-center justify-center text-brand-magenta mb-3 md:mb-6 group-hover:scale-110 group-hover:bg-brand-magenta/20 transition-all">
                      <span className="md:hidden">{getIcon(feature.icon, 20)}</span>
                      <span className="hidden md:inline">{getIcon(feature.icon, 32)}</span>
                    </div>
                    <h3 className="font-heading text-xs sm:text-base md:text-xl font-bold mb-2 text-brand-dark">{feature.title}</h3>
                    <p className="text-zinc-600 text-xs md:text-sm leading-relaxed line-clamp-3">{feature.desc}</p>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function classNameHelperAdvantage(hasBg: boolean) {
  if (hasBg) {
    return "relative overflow-hidden group h-[26rem] rounded-3xl border border-brand-magenta/10 shadow-lg cursor-pointer flex flex-col justify-end p-8";
  }
  return "glass-card p-4 md:p-8 group hover:border-brand-magenta/40 transition-colors";
}
