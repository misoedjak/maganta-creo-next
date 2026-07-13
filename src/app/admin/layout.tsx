"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
