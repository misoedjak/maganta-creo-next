"use client";

import { motion } from "framer-motion";

interface ClientItem {
  id?: string;
  name: string;
  logoUrl: string;
}

interface ClientsProps {
  clients?: ClientItem[];
}

export default function Clients({ clients = [] }: ClientsProps) {
  const fallbackClients = [
    { name: "Akurat.co", logoUrl: "/uploads/logos/akurat_co.svg" },
    { name: "Coca-Cola", logoUrl: "/uploads/logos/coca_cola.svg" },
    { name: "PwC", logoUrl: "/uploads/logos/pwc.svg" },
    { name: "UIMF", logoUrl: "/uploads/logos/uimf.svg" },
    { name: "PergiKuliner", logoUrl: "/uploads/logos/pergikuliner.svg" },
    { name: "Cedea", logoUrl: "/uploads/logos/cedea.svg" },
    { name: "Iluni FEB UI", logoUrl: "/uploads/logos/iluni_feb_ui.svg" }
  ];

  const listToRender = clients.length > 0 ? clients : fallbackClients;

  return (
    <section id="clients" className="py-16 bg-brand-light relative border-t border-brand-magenta/5">
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
          {listToRender.map((client, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-5 flex items-center justify-center min-w-[140px] md:min-w-[170px] h-20 hover:shadow-md hover:border-brand-magenta/20 transition-all cursor-pointer"
            >
              <img 
                src={client.logoUrl} 
                alt={client.name} 
                className="max-h-12 max-w-[120px] md:max-w-[140px] object-contain opacity-95 hover:opacity-100 transition-opacity"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
