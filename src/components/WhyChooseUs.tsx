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

function getIcon(name: string) {
  switch (name) {
    case "Hammer": return <Hammer size={32} />;
    case "ShieldCheck": return <ShieldCheck size={32} />;
    case "PenTool": return <PenTool size={32} />;
    case "Clock": return <Clock size={32} />;
    case "Map": return <Map size={32} />;
    case "Drill": return <Drill size={32} />;
    case "Award": return <Award size={32} />;
    case "Palette": return <Palette size={32} />;
    case "Settings": return <Settings size={32} />;
    case "Sparkles": return <Sparkles size={32} />;
    default: return <Hammer size={32} />;
  }
}

export default function WhyChooseUs({ advantages = [] }: WhyChooseUsProps) {
  const fallbackFeatures = [
    { title: "In-House Workshop", desc: "Complete control over quality and timelines with our fully-equipped fabrication facility.", icon: "Hammer" },
    { title: "Premium Materials", desc: "We source only high-grade materials to ensure structural safety and aesthetic perfection.", icon: "ShieldCheck" },
    { title: "3D Prototyping", desc: "Visualize your setup before we build it with our expert 3D rendering and design team.", icon: "PenTool" },
    { title: "Precision Engineering", desc: "Every joint and truss is engineered for maximum load-bearing safety.", icon: "Drill" },
    { title: "On-Time Build", desc: "Strict adherence to production schedules and venue bump-in times.", icon: "Clock" },
    { title: "Nationwide Deployment", desc: "Capable of manufacturing in Jakarta and deploying anywhere across Indonesia.", icon: "Map" },
  ];

  const listToRender = advantages.length > 0 
    ? advantages.map(a => ({ title: a.title, desc: a.description, icon: a.icon, bgImageUrl: a.bgImageUrl }))
    : fallbackFeatures.map(f => ({ ...f, bgImageUrl: null }));

  return (
    <section className="py-24 bg-brand-light relative border-t border-brand-magenta/5">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-brand-dark">The Maganta Advantage</h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            We don&apos;t outsource. We build. Here is why top agencies and brands trust us with their physical presence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-brand-yellow">
                        {getIcon(feature.icon)}
                      </div>
                      <span className="font-semibold text-xs tracking-wider uppercase mb-1.5 text-brand-yellow">
                        Advantage
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
                    <div className="w-16 h-16 rounded-2xl bg-brand-magenta/10 flex items-center justify-center text-brand-magenta mb-6 group-hover:scale-110 group-hover:bg-brand-magenta/20 transition-all">
                      {getIcon(feature.icon)}
                    </div>
                    <h3 className="font-heading text-xl font-bold mb-3 text-brand-dark">{feature.title}</h3>
                    <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
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
  return "glass-card p-8 group hover:border-brand-magenta/40 transition-colors";
}
