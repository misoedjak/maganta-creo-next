"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Upload, 
  Loader2, 
  Save,
  Image as ImageIcon
} from "lucide-react";
import { updateHeroSettings } from "@/app/actions/homepage";

interface HeroSettingsItem {
  id: string;
  heading: string;
  subheading: string;
  bgImageUrl: string;
  ctaText: string;
  ctaLink: string;
  portfolioText: string;
  portfolioLink: string;
}

interface HeroSettingsClientProps {
  initialSettings: HeroSettingsItem;
}

export function HeroSettingsClient({ initialSettings }: HeroSettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form Fields State
  const [heading, setHeading] = useState(initialSettings.heading);
  const [subheading, setSubheading] = useState(initialSettings.subheading);
  const [bgImageUrl, setBgImageUrl] = useState(initialSettings.bgImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [ctaText, setCtaText] = useState(initialSettings.ctaText);
  const [ctaLink, setCtaLink] = useState(initialSettings.ctaLink);
  const [portfolioText, setPortfolioText] = useState(initialSettings.portfolioText);
  const [portfolioLink, setPortfolioLink] = useState(initialSettings.portfolioLink);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to upload background image");
      }

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        setBgImageUrl(data.urls[0]);
        toast.success("Background image uploaded successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading || !subheading || !bgImageUrl) {
      toast.error("Please fill in heading, subheading, and select a background banner image");
      return;
    }

    startTransition(async () => {
      try {
        await updateHeroSettings({
          heading,
          subheading,
          bgImageUrl,
          ctaText,
          ctaLink,
          portfolioText,
          portfolioLink
        });
        toast.success("Hero settings updated successfully!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to save Hero settings");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Settings Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        
        {/* Background Image Upload */}
        <div className="space-y-2">
          <Label className="text-gray-900 font-semibold text-sm">Background Banner Image *</Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-1.5 p-4 border border-gray-100 rounded-xl bg-zinc-50/50">
            <div className="w-full sm:w-64 h-36 border border-gray-200 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {bgImageUrl ? (
                <img src={bgImageUrl} alt="Background preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 text-gray-700 font-semibold cursor-pointer text-xs transition-colors shadow-sm">
                {isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-500" />
                    <span>Uploading Banner...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5 text-gray-500" />
                    <span>Change Background Photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading || isPending}
                />
              </label>
              <p className="text-[10px] text-gray-400 max-w-xs">
                Upload a premium high-resolution banner image. Supported formats: .png, .jpg, .webp. Recommended size: 1920x1080px.
              </p>
            </div>
          </div>
        </div>

        {/* Tagline Heading */}
        <div className="space-y-1.5">
          <Label htmlFor="heading" className="text-gray-900 font-semibold text-sm">Hero Heading Tagline *</Label>
          <Input 
            id="heading" 
            placeholder="e.g. Premium Event Fabrication & Design." 
            value={heading} 
            onChange={(e) => setHeading(e.target.value)} 
            required 
            disabled={isPending}
            className="h-10 text-base"
          />
          <p className="text-[10px] text-gray-400">Tip: Use `&lt;br class=&quot;hidden md:block&quot; /&gt;` inside the text if you wish to insert a break line break on desktop.</p>
        </div>

        {/* Subheading Description */}
        <div className="space-y-1.5">
          <Label htmlFor="subheading" className="text-gray-900 font-semibold text-sm">Sub-description Paragraph *</Label>
          <textarea 
            id="subheading" 
            rows={3}
            placeholder="Introduce your fabrication solutions..." 
            value={subheading} 
            onChange={(e) => setSubheading(e.target.value)} 
            required 
            disabled={isPending}
            className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-magenta"
          />
        </div>

        {/* Buttons Row */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Button Call-to-Actions (CTAs)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Primary Button Settings */}
            <div className="space-y-4 border border-gray-100 rounded-xl p-4 bg-zinc-50/20">
              <h4 className="font-semibold text-xs text-brand-magenta uppercase tracking-wider">Primary Button</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="ctaText" className="text-xs">Button Label Text</Label>
                  <Input 
                    id="ctaText" 
                    value={ctaText} 
                    onChange={(e) => setCtaText(e.target.value)} 
                    required 
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ctaLink" className="text-xs">Link Anchor / URL</Label>
                  <Input 
                    id="ctaLink" 
                    value={ctaLink} 
                    onChange={(e) => setCtaLink(e.target.value)} 
                    required 
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>

            {/* Secondary Button Settings */}
            <div className="space-y-4 border border-gray-100 rounded-xl p-4 bg-zinc-50/20">
              <h4 className="font-semibold text-xs text-zinc-500 uppercase tracking-wider">Secondary Button</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="portfolioText" className="text-xs">Button Label Text</Label>
                  <Input 
                    id="portfolioText" 
                    value={portfolioText} 
                    onChange={(e) => setPortfolioText(e.target.value)} 
                    required 
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="portfolioLink" className="text-xs">Link Anchor / URL</Label>
                  <Input 
                    id="portfolioLink" 
                    value={portfolioLink} 
                    onChange={(e) => setPortfolioLink(e.target.value)} 
                    required 
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending || isUploading} 
          className="bg-brand-magenta text-white hover:bg-brand-magenta/90 font-semibold px-6 py-2.5 h-11 flex items-center gap-2 rounded-xl"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Hero Settings</span>
            </>
          )}
        </Button>
      </div>

    </form>
  );
}
