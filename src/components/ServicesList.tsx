"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Tent, 
  LayoutTemplate, 
  DoorOpen, 
  MapPin, 
  Palette, 
  Frame,
  ShieldCheck, 
  ChevronRight 
} from "lucide-react";
import QuoteDialog from "@/components/QuoteDialog";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  features: string | null;
}

interface ServicesListProps {
  categories: CategoryItem[];
}

function getCategoryIcon(slug: string) {
  const lower = slug.toLowerCase();
  if (lower.includes("booth")) return <Tent size={28} />;
  if (lower.includes("stage") || lower.includes("panggung")) return <LayoutTemplate size={28} />;
  if (lower.includes("backdrop") || lower.includes("dekorasi")) return <Frame size={28} />;
  if (lower.includes("gate") || lower.includes("gerbang")) return <DoorOpen size={28} />;
  if (lower.includes("sign") || lower.includes("totem") || lower.includes("direction")) return <MapPin size={28} />;
  return <Palette size={28} />;
}

export default function ServicesList({ categories }: ServicesListProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleRequestQuote = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setQuoteOpen(true);
  };

  const categoryOptions = categories.map(c => ({ id: c.id, name: c.name }));

  return (
    <>
      {categories.length === 0 ? (
        <div className="py-24 text-center text-zinc-400 text-sm border border-dashed border-zinc-200 rounded-3xl">
          No fabrication services found. Create some categories in the admin dashboard!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => {
            const featureList = category.features 
              ? category.features.split(",").map(f => f.trim()).filter(Boolean)
              : [];

            return (
              <div 
                key={category.id} 
                className="glass-card p-8 border border-brand-magenta/5 hover:border-brand-magenta/40 transition-all rounded-3xl flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-magenta/10 flex items-center justify-center text-brand-magenta shrink-0">
                      {getCategoryIcon(category.slug)}
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-brand-dark">{category.name}</h3>
                  </div>

                  {/* Description */}
                  {category.description && (
                    <p className="text-zinc-600 text-sm leading-relaxed font-light">
                      {category.description}
                    </p>
                  )}

                  {/* Feature Bullets */}
                  {featureList.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Features & Inclusions</p>
                      <ul className="grid grid-cols-2 gap-2 text-xs text-zinc-800">
                        {featureList.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-brand-magenta shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Call-to-Action Button */}
                <div className="pt-8 mt-6 border-t border-brand-magenta/5">
                  <button 
                    onClick={() => handleRequestQuote(category.name)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-magenta hover:text-brand-yellow transition-colors cursor-pointer group"
                  >
                    <span>Request Quote For This Service</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quote Dialog */}
      <QuoteDialog 
        open={quoteOpen} 
        onOpenChange={setQuoteOpen} 
        categories={categoryOptions}
        preselectedCategory={selectedCategory}
      />
    </>
  );
}
