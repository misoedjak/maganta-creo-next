const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../dev.db');
const db = new Database(dbPath);

console.log('Using SQLite Database at:', dbPath);

// ── CATEGORIES (Fabrication Services) ───────────────────────────────────────
const categoryImages = {
  'custom-exhibition-booth': '/uploads/backgrounds/ai_booth.jpg',
  'stage-fabrication':       '/uploads/backgrounds/ai_stage.jpg',
  'event-backdrop':          '/uploads/backgrounds/ai_backdrop.jpg',
  'entrance-gate':           '/uploads/backgrounds/ai_gate.jpg',
  'totem-signage':           '/uploads/backgrounds/ai_totem.jpg',
  'decorative-installation': '/uploads/backgrounds/ai_decor.jpg',
  'festival-decoration':     '/uploads/backgrounds/ai_festival.jpg',
  'branding-area':           '/uploads/backgrounds/ai_branding.jpg',
};

const categories = db.prepare('SELECT id, slug FROM Category').all();
const updateCat = db.prepare('UPDATE Category SET bgImageUrl = ? WHERE id = ?');

for (const cat of categories) {
  const img = categoryImages[cat.slug];
  if (img) {
    updateCat.run(img, cat.id);
    console.log(`✓ Category [${cat.slug}] → ${img}`);
  }
}

// ── ADVANTAGES (The Maganta Advantage) ──────────────────────────────────────
const advantages = db.prepare('SELECT id, title, "order" FROM Advantage ORDER BY "order" ASC').all();
const advantageImages = [
  '/uploads/backgrounds/ai_workshop.jpg',
  '/uploads/backgrounds/ai_materials.jpg',
  '/uploads/backgrounds/ai_stage.jpg', // Keep stage design rendering
  '/uploads/backgrounds/ai_precision.jpg',
  '/uploads/backgrounds/ai_backdrop.jpg', // Tidy timeline/planning background fallback
  '/uploads/backgrounds/ai_branding.jpg',
];

const updateAdv = db.prepare('UPDATE Advantage SET bgImageUrl = ? WHERE id = ?');
advantages.forEach((adv, i) => {
  const img = advantageImages[i % advantageImages.length];
  updateAdv.run(img, adv.id);
  console.log(`✓ Advantage [${adv.title}] → ${img}`);
});

// ── PIPELINE STEPS (Fabrication Pipeline) ───────────────────────────────────
const steps = db.prepare('SELECT id, title, "order" FROM PipelineStep ORDER BY "order" ASC').all();
const pipelineImages = [
  '/uploads/backgrounds/ai_branding.jpg',  // Briefing/consultation fallback
  '/uploads/backgrounds/ai_stage.jpg',     // 3D stage rendering
  '/uploads/backgrounds/ai_materials.jpg', // Material Selection
  '/uploads/backgrounds/ai_crafting.jpg',  // Workshop fabrication wood crafting
  '/uploads/backgrounds/ai_workshop.jpg',  // QC assembly check in shop
  '/uploads/backgrounds/ai_installation.jpg', // On-site rig setting team
  '/uploads/backgrounds/ai_dismantling.jpg',  // packing boxes/flightcases
];

const updateStep = db.prepare('UPDATE PipelineStep SET bgImageUrl = ? WHERE id = ?');
steps.forEach((step, i) => {
  const img = pipelineImages[i % pipelineImages.length];
  updateStep.run(img, step.id);
  console.log(`✓ Pipeline [${step.title}] → ${img}`);
});

db.close();
console.log('\n✅ All background images updated to custom AI-generated event fabrication renders!');
