"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import QuoteDialog from "./QuoteDialog";

interface GlobalQuoteDialogProps {
  categories: { id: string; name: string }[];
}

export default function GlobalQuoteDialog({ categories }: GlobalQuoteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const quoteParam = searchParams.get("quote");

  useEffect(() => {
    if (quoteParam === "open") {
      setIsOpen(true);
    }
  }, [quoteParam]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Clean up the ?quote=open search parameter from the current URL
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        params.delete("quote");
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
    />
  );
}
