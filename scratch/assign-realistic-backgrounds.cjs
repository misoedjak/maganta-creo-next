const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../dev.db');
const db = new Database(dbPath);

console.log('Using SQLite Database at:', dbPath);

// ── CATEGORIES (Fabrication Services) ───────────────────────────────────────
const categoryImages = {
  'custom-exhibition-booth': 'https://images.unsplash.com/photo-1565034946487-077786996e27?auto=format&fit=crop&w=1200&q=80', // Real custom exhibition booth stand at trade show
  'stage-fabrication':       'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80', // Real empty wood event stage with trussing
  'event-backdrop':          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80', // Real corporate backdrop wall setup
  'entrance-gate':           'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80', // Real entrance gate/registration archway for venue
  'totem-signage':           'https://images.unsplash.com/photo-1569437061241-a848be43cc82?auto=format&fit=crop&w=1200&q=80', // Real directional totem signage in exhibition hall
  'decorative-installation': 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80', // Real artistic lighting installation
  'festival-decoration':     'https://images.unsplash.com/photo-1481162854517-d9e353af153d?auto=format&fit=crop&w=1200&q=80', // Real outdoor festival tents and bunting
  'branding-area':           'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80', // Real corporate branding zone/ lounge desk
};

const categories = db.prepare('SELECT id, slug FROM Category').all();
const updateCat = db.prepare('UPDATE Category SET bgImageUrl = ? WHERE id = ?');

for (const cat of categories) {
  const img = categoryImages[cat.slug];
  if (img) {
    updateCat.run(img, cat.id);
    console.log(`✓ Category [${cat.slug}] updated to realistic photo`);
  }
}

// ── ADVANTAGES (The Maganta Advantage) ──────────────────────────────────────
const advantages = db.prepare('SELECT id, title, "order" FROM Advantage ORDER BY "order" ASC').all();
const advantageImages = [
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', // Real in-house industrial workshop
  'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80', // High-grade wood timber stacks
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80', // 3D CAD modeling design view on monitor
  'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=80', // Precision carpentry measurement calipers
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', // Strict timing project checklist
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80', // Nationwide logistics cargo trucks
];

const updateAdv = db.prepare('UPDATE Advantage SET bgImageUrl = ? WHERE id = ?');
advantages.forEach((adv, i) => {
  const img = advantageImages[i % advantageImages.length];
  updateAdv.run(img, adv.id);
  console.log(`✓ Advantage [${adv.title}] updated to realistic photo`);
});

// ── PIPELINE STEPS (Fabrication Pipeline) ───────────────────────────────────
const steps = db.prepare('SELECT id, title, "order" FROM PipelineStep ORDER BY "order" ASC').all();
const pipelineImages = [
  'https://images.unsplash.com/photo-1542744173-8e0ee26d22dd?auto=format&fit=crop&w=1200&q=80', // Client consultation discussion
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80', // 3D Design drafts and styling workstation
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80', // Material swatches board selection
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4e2?auto=format&fit=crop&w=1200&q=80', // Active workshop frame building
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80', // Quality testing assembly check
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80', // On-site rig setting team
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80', // Packing dismantling cases
];

const updateStep = db.prepare('UPDATE PipelineStep SET bgImageUrl = ? WHERE id = ?');
steps.forEach((step, i) => {
  const img = pipelineImages[i % pipelineImages.length];
  updateStep.run(img, step.id);
  console.log(`✓ Pipeline [${step.title}] updated to realistic photo`);
});

db.close();
console.log('\n✅ All background images updated to realistic, high-quality, professional Unsplash photos!');
