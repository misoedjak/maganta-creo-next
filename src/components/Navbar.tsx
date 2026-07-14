"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll(); // Set initial scroll state on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/#about" },
    { name: "Layanan", href: "/services" },
    { name: "Sewa Produk", href: "/products" },
    { name: "Portofolio", href: "/portfolio" },
    { name: "Klien", href: "/clients" },
    { name: "Hubungi Kami", href: "/#contact" },
  ];

  // Framer Motion variants for mobile menu stagger
  const menuVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3, ease: "easeOut" },
        opacity: { duration: 0.2 },
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.25, ease: "easeIn" },
        opacity: { duration: 0.15 },
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    open: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
    closed: { opacity: 0, y: -10 }
  };

  return (
    <>
      <motion.nav
        suppressHydrationWarning
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          (!isHome || scrolled) 
            ? "bg-brand-magenta/90 backdrop-blur-md py-2.5 lg:py-4 border-b border-brand-magenta/20 shadow-md" 
            : "bg-transparent py-4 lg:py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-white">
              MAGANTA<span className="text-[#FFD400]">KREASI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-[#FFD400] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href={`${pathname}?quote=open`}
              className="px-6 py-2.5 rounded-full bg-[#FFD400] text-black font-semibold hover:bg-white transition-colors"
            >
              Pesan disini
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="absolute top-full left-0 right-0 bg-brand-magenta/95 backdrop-blur-lg border-b border-brand-magenta/20 p-6 flex flex-col gap-5 md:hidden overflow-hidden"
            >
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={itemVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold text-white/90 hover:text-[#FFD400] block"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={itemVariants}>
                <Link
                  href={`${pathname}?quote=open`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-3 text-center rounded-full bg-[#FFD400] text-black font-bold block"
                >
                  Pesan disini
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Floating WhatsApp Action Button (Mobile Only) */}
      <a
        href="https://wa.me/6282115151515"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 md:hidden flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg shadow-[#25D366]/20 active:scale-95 transition-all hover:scale-105"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle size={28} className="fill-current" />
      </a>
    </>
  );
}
