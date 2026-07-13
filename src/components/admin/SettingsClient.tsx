"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { updateSettings } from "@/app/actions/admin";

interface SettingsData {
  id: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  siteName: string;
  seoTitle: string | null;
  seoDesc: string | null;
  gaId: string | null;
}

interface SettingsClientProps {
  settings: SettingsData;
}

export function SettingsClient({ settings }: SettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form States
  const [siteName, setSiteName] = useState(settings.siteName);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl || "");
  const [seoTitle, setSeoTitle] = useState(settings.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(settings.seoDesc || "");
  const [gaId, setGaId] = useState(settings.gaId || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName) {
      toast.error("Site name is required.");
      return;
    }

    startTransition(async () => {
      try {
        await updateSettings(settings.id, {
          siteName,
          logoUrl: logoUrl || null,
          faviconUrl: faviconUrl || null,
          seoTitle: seoTitle || null,
          seoDesc: seoDesc || null,
          gaId: gaId || null,
        });
        toast.success("Website settings updated successfully!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to update settings");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. General Settings */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">General Identity</CardTitle>
          <CardDescription>Configure site identity labels, logos, and branding assets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="settings-name">Site Display Name</Label>
            <Input
              id="settings-name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="settings-logo">Logo Asset URL</Label>
              <Input
                id="settings-logo"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="/logo.png"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-favicon">Favicon URL (.ico / .png)</Label>
              <Input
                id="settings-favicon"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="/favicon.ico"
                disabled={isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. SEO Defaults */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">SEO Default Metadata</CardTitle>
          <CardDescription>Default search engine title and descriptions if a specific project doesn't define one.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="settings-seotitle">Default Meta Title</Label>
            <Input
              id="settings-seotitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="e.g. Maganta Kreasi - Exhibition & Stage Fabrication"
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-seodesc">Default Meta Description</Label>
            <textarea
              id="settings-seodesc"
              rows={4}
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400] disabled:bg-gray-50"
              placeholder="Write a clear search description of your company services..."
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Analytics Tracking */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Integrations</CardTitle>
          <CardDescription>Connect Google Analytics or tracking tags to monitor site metrics.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="settings-ga">Google Analytics Measurement ID (G-XXXXXX)</Label>
            <Input
              id="settings-ga"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              placeholder="G-1234567890"
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pb-12">
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-[#FFD400] text-black hover:bg-[#e6be00] font-semibold h-11 px-8 rounded-xl"
        >
          {isPending ? "Saving Settings..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
