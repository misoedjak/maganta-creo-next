"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Loader2, 
  Save, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Edit3,
  X
} from "lucide-react";
import { 
  updateAboutSettings,
  createStatCard,
  updateStatCard,
  deleteStatCard,
  reorderStatCards
} from "@/app/actions/homepage";

interface AboutSettingsItem {
  id: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  features: string;
}

interface StatCardItem {
  id: string;
  number: string;
  label: string;
  order: number;
}

interface AboutSettingsClientProps {
  initialSettings: AboutSettingsItem;
  initialStats: StatCardItem[];
}

export function AboutSettingsClient({ initialSettings, initialStats }: AboutSettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // About Form State
  const [heading, setHeading] = useState(initialSettings.heading);
  const [paragraph1, setParagraph1] = useState(initialSettings.paragraph1);
  const [paragraph2, setParagraph2] = useState(initialSettings.paragraph2);
  const [features, setFeatures] = useState(initialSettings.features);

  // Stat Cards State
  const [stats, setStats] = useState<StatCardItem[]>(initialStats);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [statNumber, setStatNumber] = useState("");
  const [statLabel, setStatLabel] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading || !paragraph1 || !paragraph2) {
      toast.error("Please fill in heading and descriptions");
      return;
    }

    startTransition(async () => {
      try {
        await updateAboutSettings({
          heading,
          paragraph1,
          paragraph2,
          features
        });
        toast.success("About settings saved successfully!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to update About settings");
      }
    });
  };

  const handleAddStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statNumber || !statLabel) {
      toast.error("Please enter both number (e.g. 500+) and label (e.g. Projects Completed)");
      return;
    }

    startTransition(async () => {
      try {
        if (editingCardId) {
          // Update Mode
          const updated = await updateStatCard(editingCardId, {
            number: statNumber,
            label: statLabel,
            order: stats.find(s => s.id === editingCardId)?.order || 0
          });
          setStats(prev => prev.map(s => s.id === editingCardId ? updated : s));
          toast.success("Stat card updated successfully!");
          setEditingCardId(null);
        } else {
          // Create Mode
          const newCard = await createStatCard({
            number: statNumber,
            label: statLabel,
            order: stats.length
          });
          setStats(prev => [...prev, newCard].sort((a, b) => a.order - b.order));
          toast.success("Stat card added successfully!");
        }

        setStatNumber("");
        setStatLabel("");
        setShowAddForm(false);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to save stat card");
      }
    });
  };

  const startEditStat = (card: StatCardItem) => {
    setEditingCardId(card.id);
    setStatNumber(card.number);
    setStatLabel(card.label);
    setShowAddForm(true);
  };

  const cancelEditStat = () => {
    setEditingCardId(null);
    setStatNumber("");
    setStatLabel("");
    setShowAddForm(false);
  };

  const handleDeleteStat = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stat card?")) return;

    startTransition(async () => {
      try {
        await deleteStatCard(id);
        setStats(prev => prev.filter(s => s.id !== id));
        toast.success("Stat card deleted!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete stat card");
      }
    });
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stats.length) return;

    const newStats = [...stats];
    const temp = newStats[index];
    newStats[index] = newStats[targetIndex];
    newStats[targetIndex] = temp;

    // Recalculate orders
    const updatedWithOrders = newStats.map((item, idx) => ({
      ...item,
      order: idx
    }));

    setStats(updatedWithOrders);

    try {
      await reorderStatCards(updatedWithOrders.map(item => ({ id: item.id, order: item.order })));
      toast.success("Order updated successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to save reordered layout");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      {/* Column 1 & 2: About Copy settings */}
      <div className="xl:col-span-2 space-y-6">
        <form onSubmit={handleSaveAbout} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Konten Teks Tentang Kami</h2>

          <div className="space-y-1.5">
            <Label htmlFor="about-heading" className="text-gray-900 font-semibold text-sm">Judul Bagian Tentang Kami *</Label>
            <Input 
              id="about-heading" 
              placeholder="misal: Dedikasi untuk Kualitas & Presisi" 
              value={heading} 
              onChange={(e) => setHeading(e.target.value)} 
              required 
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="paragraph1" className="text-gray-900 font-semibold text-sm">Paragraf 1 (Fokus Utama) *</Label>
            <textarea 
              id="paragraph1" 
              rows={4}
              placeholder="Paragraf deskripsi pertama..." 
              value={paragraph1} 
              onChange={(e) => setParagraph1(e.target.value)} 
              required 
              disabled={isPending}
              className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="paragraph2" className="text-gray-900 font-semibold text-sm">Paragraf 2 (Workshop & Kemampuan) *</Label>
            <textarea 
              id="paragraph2" 
              rows={4}
              placeholder="Second description paragraph detailing operations..." 
              value={paragraph2} 
              onChange={(e) => setParagraph2(e.target.value)} 
              required 
              disabled={isPending}
              className="w-full border border-gray-200 bg-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="features" className="text-gray-900 font-semibold text-sm">Bullet Highlight Features</Label>
            <Input 
              id="features" 
              placeholder="e.g. In-house Fabrication Workshop, Premium Structural Materials, Dedicated Project Managers" 
              value={features} 
              onChange={(e) => setFeatures(e.target.value)} 
              disabled={isPending}
            />
            <p className="text-[10px] text-gray-400">Separate key bullet items with commas (e.g. Feature A, Feature B, Feature C).</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button 
              type="submit" 
              disabled={isPending} 
              className="bg-brand-magenta text-white hover:bg-brand-magenta/90 font-semibold px-5 py-2 h-10 flex items-center gap-2 rounded-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving About Copy...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save About Content</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Column 3: Stats cards list manager */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-900 text-lg">Numeric Stat Cards</h2>
            {!showAddForm && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs px-3 py-1.5 h-8 flex items-center gap-1.5 rounded-lg border border-gray-200"
              >
                <Plus size={14} />
                <span>Add Stat</span>
              </Button>
            )}
          </div>

          {/* Add/Edit Stat Form Overlay/View */}
          {showAddForm && (
            <form onSubmit={handleAddStat} className="p-4 border border-zinc-100 rounded-xl bg-zinc-50/50 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs uppercase tracking-wider text-brand-magenta">
                  {editingCardId ? "Edit Stat Card" : "New Stat Card"}
                </span>
                <button type="button" onClick={cancelEditStat} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="statNumber" className="text-xs">Metric Number *</Label>
                  <Input 
                    id="statNumber" 
                    placeholder="e.g. 500+ or 100%" 
                    value={statNumber} 
                    onChange={(e) => setStatNumber(e.target.value)} 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="statLabel" className="text-xs">Description Label *</Label>
                  <Input 
                    id="statLabel" 
                    placeholder="e.g. Projects Completed" 
                    value={statLabel} 
                    onChange={(e) => setStatLabel(e.target.value)} 
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  onClick={cancelEditStat}
                  className="bg-white text-gray-700 hover:bg-gray-50 text-xs border border-gray-200 px-3 py-1.5 h-8 rounded-lg"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-brand-magenta text-white hover:bg-brand-magenta/90 text-xs font-semibold px-4 py-1.5 h-8 rounded-lg"
                >
                  {editingCardId ? "Update Stat" : "Add Stat"}
                </Button>
              </div>
            </form>
          )}

          {/* Stat Cards Table list */}
          <div className="space-y-3">
            {stats.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm">
                No stats defined yet. Click "Add Stat" above to build your showcase grid!
              </div>
            ) : (
              stats.map((card, index) => (
                <div 
                  key={card.id} 
                  className="flex items-center justify-between p-3 border border-gray-100 bg-white hover:bg-zinc-50/50 rounded-lg shadow-sm transition-colors"
                >
                  <div>
                    <div className="text-base font-bold text-brand-magenta">{card.number}</div>
                    <div className="text-xs text-gray-500">{card.label}</div>
                  </div>
                  
                  {/* Actions (Reorder & Edit & Delete) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                      onClick={() => handleMove(index, "up")} 
                      disabled={index === 0 || isPending}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      onClick={() => handleMove(index, "down")} 
                      disabled={index === stats.length - 1 || isPending}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button 
                      onClick={() => startEditStat(card)} 
                      disabled={isPending}
                      className="p-1.5 hover:bg-yellow-50 hover:text-yellow-600 rounded text-gray-500"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteStat(card.id)} 
                      disabled={isPending}
                      className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded text-gray-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
