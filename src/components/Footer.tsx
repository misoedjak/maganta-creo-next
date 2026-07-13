import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";

interface FooterProps {
  profile?: {
    email: string | null;
    phone: string | null;
    phoneName: string | null;
    phone2: string | null;
    phone2Name: string | null;
    address: string | null;
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    whatsapp: string | null;
    whatsappName: string | null;
    whatsapp2: string | null;
    whatsapp2Name: string | null;
  } | null;
}

export default function Footer({ profile }: FooterProps) {
  const instagramLink = profile?.instagram 
    ? `https://instagram.com/${profile.instagram}`
    : "#";

  const primaryWaLink = profile?.whatsapp
    ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`
    : "#";

  return (
    <footer className="bg-brand-magenta text-white pt-20 pb-10 border-t border-white/10 shadow-inner">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Desc */}
          <div>
            <div className="font-heading text-2xl font-bold tracking-wider mb-6 text-white">
              MAGANTA<span className="text-brand-yellow">KREASI</span>
            </div>
            <p className="text-pink-100/90 mb-6 leading-relaxed text-sm">
              Premium Event Fabrication & Decoration Solutions. From Custom Exhibition Booths to Massive Festival Stages.
            </p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a 
                href={instagramLink} 
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              {/* Facebook */}
              <a 
                href={profile?.facebook || "#"} 
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              {/* LinkedIn */}
              <a 
                href={profile?.linkedin || "#"} 
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/#" },
                { name: "About Workshop", href: "/#about" },
                { name: "Fabrication Portfolio", href: "/#portfolio" },
                { name: "Our Process", href: "/#process" }
              ].map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-pink-100/90 hover:text-brand-yellow transition-colors text-sm">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak Section */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-6 text-white">Kontak</h4>
            <ul className="space-y-4 text-sm text-pink-100/95">
              {profile?.phone && (
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center shrink-0">
                    <Phone size={14} />
                  </div>
                  <span className="text-white">
                    {profile.phoneName ? `${profile.phoneName} - ` : ""}{profile.phone}
                  </span>
                </li>
              )}
              {profile?.phone2 && (
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center shrink-0">
                    <Phone size={14} />
                  </div>
                  <span className="text-white">
                    {profile.phone2Name ? `${profile.phone2Name} - ` : ""}{profile.phone2}
                  </span>
                </li>
              )}
              {profile?.whatsapp && (
                <li className="flex items-center gap-3">
                  <a 
                    href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 hover:text-brand-yellow transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center shrink-0">
                      <MessageSquare size={14} />
                    </div>
                    <span className="text-white">
                      {profile.whatsappName ? `${profile.whatsappName} - ` : ""}{profile.whatsapp}
                    </span>
                  </a>
                </li>
              )}
              {profile?.whatsapp2 && (
                <li className="flex items-center gap-3">
                  <a 
                    href={`https://wa.me/${profile.whatsapp2.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 hover:text-brand-yellow transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center shrink-0">
                      <MessageSquare size={14} />
                    </div>
                    <span className="text-white">
                      {profile.whatsapp2Name ? `${profile.whatsapp2Name} - ` : ""}{profile.whatsapp2}
                    </span>
                  </a>
                </li>
              )}
              {profile?.email && (
                <li className="flex items-center gap-3">
                  <a 
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 hover:text-brand-yellow transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center shrink-0">
                      <Mail size={14} />
                    </div>
                    <span className="text-white">Email - {profile.email}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Alamat Section */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-6 text-white">Alamat</h4>
            <ul className="space-y-4 text-sm text-pink-100/95">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center shrink-0 mt-1">
                  <MapPin size={14} />
                </div>
                <span className="whitespace-pre-line leading-relaxed text-white">
                  {profile?.address || "Jakarta, Indonesia"}
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-pink-200/80">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p>&copy;2025 Maganta Kreasi. All Rights Reserved.</p>
            <p>Published by <a href="https://www.asain.co.id" target="_blank" rel="noreferrer" className="text-brand-yellow hover:underline font-medium">www.asain.co.id</a></p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-yellow transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-yellow transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
