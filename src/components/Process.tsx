"use client";

import { motion } from "framer-motion";

interface PipelineStepItem {
  id: string;
  title: string;
  description: string;
  bgImageUrl?: string | null;
  order: number;
}

interface ProcessProps {
  steps?: PipelineStepItem[];
}

export default function Process({ steps = [] }: ProcessProps) {
  const fallbackSteps = [
    { title: "Consultation & Briefing", desc: "Understanding your brand vision, space constraints, and budget.", bgImageUrl: null },
    { title: "3D Design & Rendering", desc: "Providing photorealistic mockups and structural floor plans.", bgImageUrl: null },
    { title: "Material Selection", desc: "Sourcing the exact wood, metal, and finishes required.", bgImageUrl: null },
    { title: "Workshop Fabrication", desc: "Carpentry, metalwork, and painting at our dedicated facility.", bgImageUrl: null },
    { title: "Quality Control Setup", desc: "Pre-assembling complex structures in our workshop to guarantee fit.", bgImageUrl: null },
    { title: "On-site Installation", desc: "Safe, rapid bump-in and construction at the event venue.", bgImageUrl: null },
    { title: "Dismantling", desc: "Clean teardown and logistics removal post-event.", bgImageUrl: null },
  ];

  const listToRender = steps.length > 0
    ? steps.map((s, idx) => ({
        num: (idx + 1).toString().padStart(2, "0"),
        title: s.title,
        desc: s.description,
        bgImageUrl: s.bgImageUrl ?? null,
      }))
    : fallbackSteps.map((s, idx) => ({
        num: (idx + 1).toString().padStart(2, "0"),
        title: s.title,
        desc: s.desc,
        bgImageUrl: s.bgImageUrl,
      }));

  return (
    <section id="process" className="py-16 md:py-24 bg-brand-light relative overflow-hidden border-t border-brand-magenta/5" suppressHydrationWarning>
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-brand-dark">Fabrication Pipeline</h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            A systematic approach from raw timber to jaw-dropping event architecture.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {listToRender.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 md:gap-10 mb-6 relative"
            >
              {/* Vertical connector line */}
              {i !== listToRender.length - 1 && (
                <div className="absolute left-6 top-16 bottom-[-24px] w-[2px] bg-gradient-to-b from-brand-magenta/50 to-transparent md:left-8 z-10" />
              )}

              {/* Step Number Circle */}
              <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full bg-brand-magenta border-2 border-brand-magenta/30 flex items-center justify-center font-heading text-lg md:text-xl font-bold text-white z-10 shadow-lg shadow-brand-magenta/30">
                {step.num}
              </div>

              {/* Step Card */}
              <div className="flex-1 mb-2 rounded-2xl overflow-hidden shadow-md group">
                {step.bgImageUrl ? (
                  /* Background photo card */
                  <div className="relative w-full h-36 md:h-40">
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 z-10" />
                    <img
                      src={step.bgImageUrl}
                      alt={step.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Text on top */}
                    <div className="relative z-20 p-5 md:p-7 flex flex-col justify-center h-full">
                      <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">{step.title}</h3>
                      <p className="text-white/75 text-sm md:text-base leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ) : (
                  /* Plain card fallback */
                  <div className="glass-card p-5 md:p-7 pt-4 h-full">
                    <h3 className="font-heading text-xl md:text-2xl font-bold mb-2 text-brand-dark">{step.title}</h3>
                    <p className="text-zinc-600 text-sm md:text-base leading-relaxed">{step.desc}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
