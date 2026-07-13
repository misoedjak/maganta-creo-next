const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../dev.db');
const db = new Database(dbPath);

console.log('Using SQLite Database at:', dbPath);

// ── CATEGORIES (Fabrication Services) ───────────────────────────────────────
const categoryImages = {
  'custom-exhibition-booth': 'https://images.unsplash.com/photo-1582192732961-d70aa33eb5c6?auto=format&fit=crop&w=1200&q=80', // Exhibition stands/booths in event hall
  'stage-fabrication':       'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80', // Real event stage structure and trussing
  'event-backdrop':          'https://images.unsplash.com/photo-1505232458627-539f9765a5d5?auto=format&fit=crop&w=1200&q=80', // Event backdrop screens/setup in a ballroom
  'entrance-gate':           'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=1200&q=80', // Entrance portal archway structure
  'totem-signage':           'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80', // Event information totem/stand display
  'decorative-installation': 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80', // Luxury banquet hall decorative ceiling/flower setup
  'festival-decoration':     'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80', // Outdoor music festival lights and builds
  'branding-area':           'https://images.unsplash.com/photo-1531058020387-3be344559767?auto=format&fit=crop&w=1200&q=80', // Branded corporate sponsor banner area
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
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80', // Carpentry wood workshop
  'https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&w=1200&q=80', // Solid raw wood planks stacked
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80', // Designing 3D plans on display
  'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=1200&q=80', // Measuring tape/carpentry precision tools
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80', // Construction worker with planning calendar/helmet
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80', // Box trucks transporting cargo
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
  'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=1200&q=80', // Consultation meeting
  'https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?auto=format&fit=crop&w=1200&q=80', // Designer screen setup
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80', // Wood, textile swatches on table
  'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?auto=format&fit=crop&w=1200&q=80', // Active carpentry saw fabrication
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80', // Inspecting build setup in shop
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80', // Workers installing trusses on site
  'https://images.unsplash.com/photo-1513828729020-044737ad7315?auto=format&fit=crop&w=1200&q=80', // Dismantling/packing flightcases in warehouse
];

const updateStep = db.prepare('UPDATE PipelineStep SET bgImageUrl = ? WHERE id = ?');
steps.forEach((step, i) => {
  const img = pipelineImages[i % pipelineImages.length];
  updateStep.run(img, step.id);
  console.log(`✓ Pipeline [${step.title}] updated to realistic photo`);
});

db.close();
console.log('\n✅ All background images updated to highly realistic event fabrication photos!');
