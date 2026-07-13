const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../dev.db');
const db = new Database(dbPath);

// ── CATEGORIES ──────────────────────────────────────────────────────────────
const categoryImages = {
  'custom-exhibition-booth': '/uploads/backgrounds/booth.jpg',
  'stage-fabrication':       '/uploads/backgrounds/stage.jpg',
  'event-backdrop':          '/uploads/backgrounds/backdrop.jpg',
  'entrance-gate':           '/uploads/backgrounds/gate.jpg',
  'totem-signage':           '/uploads/backgrounds/totem.jpg',
  'decorative-installation': '/uploads/backgrounds/decor.jpg',
  'festival-decoration':     '/uploads/backgrounds/decor.jpg',
  'branding-area':           '/uploads/backgrounds/booth.jpg',
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

// ── ADVANTAGES ──────────────────────────────────────────────────────────────
const advantages = db.prepare('SELECT id, title, "order" FROM Advantage ORDER BY "order" ASC').all();
const advantageImages = [
  '/uploads/backgrounds/workshop.jpg',
  '/uploads/backgrounds/precision.jpg',
  '/uploads/backgrounds/stage.jpg',
  '/uploads/backgrounds/installation.jpg',
  '/uploads/backgrounds/booth.jpg',
  '/uploads/backgrounds/gate.jpg',
];

const updateAdv = db.prepare('UPDATE Advantage SET bgImageUrl = ? WHERE id = ?');
advantages.forEach((adv, i) => {
  const img = advantageImages[i % advantageImages.length];
  updateAdv.run(img, adv.id);
  console.log(`✓ Advantage [${adv.title}] → ${img}`);
});

// ── PIPELINE STEPS ──────────────────────────────────────────────────────────
const steps = db.prepare('SELECT id, title, "order" FROM PipelineStep ORDER BY "order" ASC').all();
const pipelineImages = [
  '/uploads/backgrounds/precision.jpg',
  '/uploads/backgrounds/booth.jpg',
  '/uploads/backgrounds/workshop.jpg',
  '/uploads/backgrounds/workshop.jpg',
  '/uploads/backgrounds/precision.jpg',
  '/uploads/backgrounds/installation.jpg',
  '/uploads/backgrounds/gate.jpg',
];

const updateStep = db.prepare('UPDATE PipelineStep SET bgImageUrl = ? WHERE id = ?');
steps.forEach((step, i) => {
  const img = pipelineImages[i % pipelineImages.length];
  updateStep.run(img, step.id);
  console.log(`✓ Pipeline [${step.title}] → ${img}`);
});

db.close();
console.log('\n✅ All background images assigned!');
