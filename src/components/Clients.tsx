"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ClientItem {
  id?: string;
  name: string;
  logoUrl: string;
  portfolioSlug?: string | null;
}

interface ClientsProps {
  clients?: ClientItem[];
}

export default function Clients({ clients = [] }: ClientsProps) {
  const fallbackClients: ClientItem[] = [
    { name: "Akurat.co", logoUrl: "/uploads/logos/akurat_co.svg", portfolioSlug: null },
    { name: "Coca-Cola", logoUrl: "/uploads/logos/coca_cola.svg", portfolioSlug: null },
    { name: "PwC", logoUrl: "/uploads/logos/pwc.svg", portfolioSlug: null },
    { name: "UIMF", logoUrl: "/uploads/logos/uimf.svg", portfolioSlug: null },
    { name: "PergiKuliner", logoUrl: "/uploads/logos/pergikuliner.svg", portfolioSlug: null },
    { name: "Cedea", logoUrl: "/uploads/logos/cedea.svg", portfolioSlug: null },
    { name: "Iluni FEB UI", logoUrl: "/uploads/logos/iluni_feb_ui.svg", portfolioSlug: null }
  ];

  const listToRender = clients.length > 0 ? clients : fallbackClients;

  return (
    <section id="clients" className="py-16 bg-brand-light relative border-t border-brand-magenta/5" suppressHydrationWarning>
      <div className="container mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center flex flex-col items-center"
        >
          <h2 className="font-heading text-3xl font-bold text-brand-magenta mb-2">Our Clients</h2>
          <div className="w-12 h-1 bg-brand-yellow rounded-full" />
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          {listToRender.map((client, idx) => {
            const cardContent = (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex items-center justify-center p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <img 
                  src={`${client.logoUrl}?v=2`} 
                  alt={client.name} 
                  className="max-h-16 md:max-h-20 max-w-[180px] md:max-w-[220px] object-contain opacity-95 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            );

            if (client.portfolioSlug) {
              return (
                <Link key={idx} href={`/portfolio/${client.portfolioSlug}`}>
                  {cardContent}
                </Link>
              );
            }

            return <div key={idx}>{cardContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
