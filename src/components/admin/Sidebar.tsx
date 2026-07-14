"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderTree, 
  Mail, 
  Building2, 
  Image, 
  Users, 
  Settings, 
  LogOut,
  ShieldCheck,
  Milestone,
  Handshake,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Info,
  Package // Added Package icon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuGroups: Record<string, MenuGroup> = {
  sales: {
    label: "Penjualan & Prospek",
    items: [
      { name: "Permintaan Penawaran", href: "/admin/quotes", icon: Mail },
      { name: "Klien", href: "/admin/clients", icon: Handshake },
    ]
  },
  content: {
    label: "Manajemen Konten",
    items: [
      { name: "Produk Sewa", href: "/admin/products", icon: Package },
      { name: "Portofolio", href: "/admin/portfolio", icon: Briefcase },
      { name: "Layanan Pameran", href: "/admin/categories", icon: FolderTree },
      { name: "Galeri", href: "/admin/gallery", icon: Image },
    ]
  },
  company: {
    label: "Profil Perusahaan",
    items: [
      { name: "Tentang Perusahaan", href: "/admin/profile", icon: Building2 },
      { name: "Pengaturan Hero", href: "/admin/hero", icon: Sparkles },
      { name: "Tentang & Statistik", href: "/admin/about", icon: Info },
      { name: "Keunggulan", href: "/admin/advantages", icon: ShieldCheck },
      { name: "Proses Kerja", href: "/admin/pipeline", icon: Milestone },
    ]
  },
  admin: {
    label: "Administrasi",
    items: [
      { name: "Pengguna", href: "/admin/users", icon: Users },
      { name: "Pengaturan", href: "/admin/settings", icon: Settings },
    ]
  }
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});



  // Auto-expand group if a child link inside it is currently active
  useEffect(() => {
    const activeGroupKey = Object.keys(menuGroups).find((key) => 
      menuGroups[key].items.some((item) => 
        pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
      )
    );
    if (activeGroupKey) {
      setExpandedGroups((prev) => {
        if (prev[activeGroupKey]) return prev; // Prevent redundant state updates/renders
        return {
          ...prev,
          [activeGroupKey]: true
        };
      });
    }
  }, [pathname]);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#be3168] text-white flex flex-col border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 shrink-0">
        <Link href="/admin" className="text-xl font-bold tracking-wider text-white">
          MAGANTA<span className="text-[#FFD400]">KREASI</span>
        </Link>
        <div className="text-[10px] text-pink-200 mt-1 uppercase tracking-widest font-semibold">
          Admin Dashboard
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
        
        {/* Dashboard Direct Link */}
        <div>
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
              pathname === "/admin" 
                ? "bg-white text-[#be3168] font-bold shadow-md shadow-black/10" 
                : "text-white/80 hover:bg-white/10 hover:text-white"
            )}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Collapsible Groups */}
        {Object.entries(menuGroups).map(([key, group]) => {
          const isExpanded = !!expandedGroups[key];
          
          return (
            <div key={key} className="space-y-1">
              
              {/* Group Toggle Header */}
              <button
                onClick={() => toggleGroup(key)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-pink-200/70 uppercase tracking-wider hover:text-white transition-colors"
              >
                <span>{group.label}</span>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {/* Group Child Items */}
              {isExpanded && (
                <div className="pl-2 space-y-1 transition-all duration-300">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                          isActive 
                            ? "bg-white text-[#be3168] font-bold shadow-md shadow-black/10" 
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-white/80 hover:text-red-200 hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
    </>
  );
}
