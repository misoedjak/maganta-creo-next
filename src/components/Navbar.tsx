"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, Settings, Edit3, Lock, Smartphone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface NavbarProps {
  whatsappNumber?: string;
}

export default function Navbar({ whatsappNumber = "6282115151515" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [devToolOpen, setDevToolOpen] = useState(false);
  const [visualEditActive, setVisualEditActive] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll(); // Set initial scroll state on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + E or Cmd + E
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        const isEditMode = document.designMode === "on";
        document.designMode = isEditMode ? "off" : "on";
        
        if (isEditMode) {
          toast.success("Mode Edit Visual Dinonaktifkan", {
            description: "Editan browser bersifat sementara. Gunakan Dashboard Admin untuk menyimpan permanen.",
            duration: 5000,
          });
        } else {
          toast.success("Mode Edit Visual Diaktifkan!", {
            description: "Klik dan ketik teks apa saja pada halaman untuk mengubahnya langsung.",
            duration: 6000,
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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



  return (
    <>
      <motion.nav
        suppressHydrationWarning
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          mobileMenuOpen
            ? "bg-transparent py-2.5"
            : scrolled 
              ? "bg-brand-magenta/95 backdrop-blur-md py-2.5 lg:py-4 border-b border-white/10 shadow-lg shadow-black/10" 
              : "bg-brand-magenta/95 backdrop-blur-md py-3 lg:py-5 border-b border-white/10 shadow-lg shadow-black/10"
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
                className="text-sm font-medium text-white/80 hover:text-[#FFD400] transition-all relative py-1.5 group"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD400] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              href={`${pathname}?quote=open`}
              className="px-6 py-2.5 rounded-full bg-[#FFD400] text-black font-semibold hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#FFD400]/25"
            >
              Pesan disini
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white z-50 relative p-2 active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              key={mobileMenuOpen ? "close" : "menu"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X size={24} className="text-[#FFD400]" /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-brand-magenta/95 backdrop-blur-xl flex flex-col justify-between p-8 pt-28 md:hidden"
            >
              {/* Nav links */}
              <div className="flex flex-col gap-6">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-3xl font-heading font-bold text-white hover:text-[#FFD400] transition-colors block"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Extra Info / CTA at bottom of menu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex flex-col gap-5 border-t border-white/10 pt-6"
              >
                <Link
                  href={`${pathname}?quote=open`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 text-center rounded-full bg-[#FFD400] text-black font-bold text-lg hover:bg-white transition-colors block shadow-md"
                >
                  Pesan disini
                </Link>
                <div className="flex justify-between items-center text-[10px] text-white/60">
                  <span>hello@magantakreasi.id</span>
                  <span>+62 821 1515 1515</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Floating WhatsApp Action Button (Mobile Only) */}
      <a
        href={`https://wa.me/${(() => {
          let clean = whatsappNumber.replace(/[^0-9]/g, "");
          if (clean.startsWith("0")) {
            clean = "62" + clean.substring(1);
          }
          return clean;
        })()}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 md:hidden flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg shadow-[#25D366]/20 active:scale-95 transition-all hover:scale-105"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle size={28} className="fill-current" />
      </a>

      {/* Floating Developer Toolbar (Localhost Only) */}
      {typeof window !== "undefined" && window.location.hostname === "localhost" && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => setDevToolOpen(!devToolOpen)}
            className="flex items-center justify-center w-12 h-12 bg-gray-900 text-[#FFD400] rounded-full shadow-xl border border-gray-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Developer Tools"
          >
            <Settings size={20} className={devToolOpen ? "animate-spin" : ""} />
          </button>
          
          <AnimatePresence>
            {devToolOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-14 left-0 bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 min-w-[200px]"
              >
                <div className="text-[10px] font-bold text-gray-400 px-2 uppercase tracking-wider">
                  Pengatur UI (Local)
                </div>
                
                {/* Choice 1: Edit Teks */}
                <button
                  onClick={() => {
                    const nextMode = document.designMode === "on" ? "off" : "on";
                    document.designMode = nextMode;
                    setVisualEditActive(nextMode === "on");
                    toast.success(nextMode === "on" ? "Mode Edit Aktif!" : "Mode Edit Mati", {
                      description: nextMode === "on" 
                        ? "Klik teks mana saja pada halaman untuk mengubahnya langsung." 
                        : "Perubahan bersifat sementara. Simpan di Admin untuk permanen."
                    });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    visualEditActive 
                      ? "bg-[#be3168] text-white" 
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Edit3 size={14} /> 
                  {visualEditActive ? "Matikan Edit Teks" : "Edit Teks Langsung"}
                </button>

                {/* Choice 2: Admin Panel */}
                <Link
                  href="/admin"
                  target="_blank"
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Lock size={14} /> Dashboard Admin
                </Link>

                {/* Choice 3: Device Emulator Info */}
                <button
                  onClick={() => {
                    toast.info("Tampilan Responsive", {
                      description: "Tekan F12 lalu klik ikon HP (Ctrl+Shift+M) di Chrome untuk melihat mode Mobile/Tablet.",
                      duration: 8000
                    });
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Smartphone size={14} /> Tampilan Mobile
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
