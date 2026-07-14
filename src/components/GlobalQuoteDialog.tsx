"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import QuoteDialog from "./QuoteDialog";

interface GlobalQuoteDialogProps {
  categories: { id: string; name: string }[];
}

export default function GlobalQuoteDialog({ categories }: GlobalQuoteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState("");
  const searchParams = useSearchParams();
  const quoteParam = searchParams.get("quote");
  const eventParam = searchParams.get("event");

  useEffect(() => {
    if (quoteParam === "open") {
      setTimeout(() => {
        setIsOpen(true);
      }, 0);
    }
  }, [quoteParam]);

  useEffect(() => {
    if (eventParam && categories) {
      const found = categories.find(c => c.id === eventParam);
      if (found) {
        setTimeout(() => {
          setPreselectedCategory(found.name);
          setIsOpen(true);
        }, 0);
      }
    }
  }, [eventParam, categories]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Clean up the search parameters from the current URL
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        params.delete("quote");
        params.delete("event");
        const newSearch = params.toString();
        const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
        window.history.replaceState(null, "", newUrl);
      }
    }
  };

  return (
    <QuoteDialog 
      open={isOpen} 
      onOpenChange={handleOpenChange} 
      categories={categories} 
      preselectedCategory={preselectedCategory}
    />
  );
}
