"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { User, Bell, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Generate simple breadcrumbs from path
  const paths = pathname.split("/").filter(Boolean);
  
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 text-gray-800 shadow-sm shrink-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <Link href="/admin" className="hover:text-gray-900 transition-colors">
          Admin
        </Link>
        {paths.slice(1).map((path, idx) => {
          const href = `/admin/${paths.slice(1, idx + 2).join("/")}`;
          const isLast = idx === paths.length - 2;
          const label = path.replace(/-/g, " ");

          return (
            <div key={path} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link 
                href={href} 
                className={`hover:text-gray-900 capitalize transition-colors ${isLast ? "text-gray-900 font-semibold" : ""}`}
              >
                {label}
              </Link>
            </div>
          );
        })}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* View Live Site Link */}
        <Link 
          href="/" 
          target="_blank"
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-1"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Live Site</span>
        </Link>

        {/* Notifications (Placeholder) */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FFD400]"></span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600">
            <User className="h-5 w-5" />
          </div>
          <div className="text-left hidden md:block">
            <div className="text-sm font-semibold text-gray-900">
              {session?.user?.name || "Administrator"}
            </div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {session?.user?.role || "ADMIN"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
