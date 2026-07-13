"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { updateCompanyProfile } from "@/app/actions/admin";

interface ProfileData {
  id: string;
  name: string;
  description: string | null;
  vision: string | null;
  mission: string | null;
  address: string | null;
  phone: string | null;
  phoneName: string | null;
  phone2: string | null;
  phone2Name: string | null;
  email: string | null;
  mapUrl: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  whatsapp: string | null;
  whatsappName: string | null;
  whatsapp2: string | null;
  whatsapp2Name: string | null;
}

interface ProfileClientProps {
  profile: ProfileData;
}

export function ProfileClient({ profile }: ProfileClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form States
  const [name, setName] = useState(profile.name);
  const [description, setDescription] = useState(profile.description || "");
  const [vision, setVision] = useState(profile.vision || "");
  const [mission, setMission] = useState(profile.mission || "");
  const [address, setAddress] = useState(profile.address || "");
  
  const [phoneName, setPhoneName] = useState(profile.phoneName || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [phone2Name, setPhone2Name] = useState(profile.phone2Name || "");
  const [phone2, setPhone2] = useState(profile.phone2 || "");

  const [whatsappName, setWhatsappName] = useState(profile.whatsappName || "");
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp || "");
  const [whatsapp2Name, setWhatsapp2Name] = useState(profile.whatsapp2Name || "");
  const [whatsapp2, setWhatsapp2] = useState(profile.whatsapp2 || "");

  const [email, setEmail] = useState(profile.email || "");
  const [mapUrl, setMapUrl] = useState(profile.mapUrl || "");
  const [instagram, setInstagram] = useState(profile.instagram || "");
  const [facebook, setFacebook] = useState(profile.facebook || "");
  const [linkedin, setLinkedin] = useState(profile.linkedin || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Company name is required.");
      return;
    }

    startTransition(async () => {
      try {
        await updateCompanyProfile(profile.id, {
          name,
          description: description || null,
          vision: vision || null,
          mission: mission || null,
          address: address || null,
          phone: phone || null,
          phoneName: phoneName || null,
          phone2: phone2 || null,
          phone2Name: phone2Name || null,
          email: email || null,
          mapUrl: mapUrl || null,
          instagram: instagram || null,
          facebook: facebook || null,
          linkedin: linkedin || null,
          whatsapp: whatsapp || null,
          whatsappName: whatsappName || null,
          whatsapp2: whatsapp2 || null,
          whatsapp2Name: whatsapp2Name || null,
        });
        toast.success("Company profile updated successfully!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to update profile");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. General Profile */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">General Information</CardTitle>
          <CardDescription>Configure core branding name, descriptions, vision, and mission.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">Company Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-desc">About Description</Label>
            <textarea
              id="profile-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400] disabled:bg-gray-50 text-gray-900"
              placeholder="Tell clients about your workspace and fabrication expertise..."
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="profile-vision">Vision</Label>
              <textarea
                id="profile-vision"
                rows={3}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400] disabled:bg-gray-50 text-gray-900"
                placeholder="Company's future goals..."
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-mission">Mission</Label>
              <textarea
                id="profile-mission"
                rows={3}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400] disabled:bg-gray-50 text-gray-900"
                placeholder="How you will achieve the vision..."
                disabled={isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Contact Details */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Contact & Address</CardTitle>
          <CardDescription>Configure physical address, phone, support email, and Google Maps embed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-4 border-b border-gray-100 pb-6">
            <h4 className="font-semibold text-sm text-gray-800">Phone Contacts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="profile-phone-name">Phone 1 Contact Name</Label>
                <Input
                  id="profile-phone-name"
                  value={phoneName}
                  onChange={(e) => setPhoneName(e.target.value)}
                  placeholder="e.g. Evan Juanito"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-phone">Phone 1 Number</Label>
                <Input
                  id="profile-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0895-3311-05277"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-phone2-name">Phone 2 Contact Name</Label>
                <Input
                  id="profile-phone2-name"
                  value={phone2Name}
                  onChange={(e) => setPhone2Name(e.target.value)}
                  placeholder="e.g. Graciela Clara Santi"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-phone2">Phone 2 Number</Label>
                <Input
                  id="profile-phone2"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  placeholder="e.g. 0811-1195-870"
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-b border-gray-100 pb-6">
            <h4 className="font-semibold text-sm text-gray-800">WhatsApp Contacts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="profile-wa-name">WhatsApp 1 Contact Name</Label>
                <Input
                  id="profile-wa-name"
                  value={whatsappName}
                  onChange={(e) => setWhatsappName(e.target.value)}
                  placeholder="e.g. Evan Juanito"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-wa">WhatsApp 1 Number</Label>
                <Input
                  id="profile-wa"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. 0895-3311-05277"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-wa2-name">WhatsApp 2 Contact Name</Label>
                <Input
                  id="profile-wa2-name"
                  value={whatsapp2Name}
                  onChange={(e) => setWhatsapp2Name(e.target.value)}
                  placeholder="e.g. Graciela Clara Santi"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-wa2">WhatsApp 2 Number</Label>
                <Input
                  id="profile-wa2"
                  value={whatsapp2}
                  onChange={(e) => setWhatsapp2(e.target.value)}
                  placeholder="e.g. 0811-1195-870"
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="profile-email">Corporate Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@magantakreasi.com"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-map">Google Maps Embed URL</Label>
              <Input
                id="profile-map"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-address">Office & Workshop Address</Label>
            <textarea
              id="profile-address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400] disabled:bg-gray-50 text-gray-900"
              placeholder="Enter full physical address..."
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Social Integration */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Social Media Links</CardTitle>
          <CardDescription>Integrate social pages and messaging links directly onto the website.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="profile-instagram">Instagram Handle</Label>
            <Input
              id="profile-instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="e.g. magantakreasi"
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-facebook">Facebook Page Link</Label>
            <Input
              id="profile-facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/..."
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-linkedin">LinkedIn Company URL</Label>
            <Input
              id="profile-linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/company/..."
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
          {isPending ? "Saving Profile..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
