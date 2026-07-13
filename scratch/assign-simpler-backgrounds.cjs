const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../dev.db');
const db = new Database(dbPath);

console.log('Using SQLite Database at:', dbPath);

// ── CATEGORIES ──────────────────────────────────────────────────────────────
const categoryImages = {
  'custom-exhibition-booth': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', // Minimalist clean office
  'stage-fabrication':       'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80', // Simple stage spotlight
  'event-backdrop':          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', // Minimalist beige curve
  'entrance-gate':           'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', // Sleek architectural facade
  'totem-signage':           'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80', // Minimalist layout display
  'decorative-installation': 'https://images.unsplash.com/photo-1519225495810-7517c696565a?auto=format&fit=crop&w=1200&q=80', // Elegant floral installation
  'festival-decoration':     'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80', // Warm simple cafe lights
  'branding-area':           'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', // Clean minimalist lobby
};

const categories = db.prepare('SELECT id, slug FROM Category').all();
const updateCat = db.prepare('UPDATE Category SET bgImageUrl = ? WHERE id = ?');

for (const cat of categories) {
  const img = categoryImages[cat.slug];
  if (img) {
    updateCat.run(img, cat.id);
    console.log(`✓ Category [${cat.slug}] updated to simpler picture`);
  }
}

// ── ADVANTAGES ──────────────────────────────────────────────────────────────
const advantages = db.prepare('SELECT id, title, "order" FROM Advantage ORDER BY "order" ASC').all();
const advantageImages = [
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80', // Organized workshop
  'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80', // Minimalist clean texture
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80', // Minimalist computer draft
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80', // Sleek building plans
  'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1200&q=80', // Simple watch
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80', // Clean shipping container/delivery
];

const updateAdv = db.prepare('UPDATE Advantage SET bgImageUrl = ? WHERE id = ?');
advantages.forEach((adv, i) => {
  const img = advantageImages[i % advantageImages.length];
  updateAdv.run(img, adv.id);
  console.log(`✓ Advantage [${adv.title}] updated to simpler picture`);
});

// ── PIPELINE STEPS ──────────────────────────────────────────────────────────
const steps = db.prepare('SELECT id, title, "order" FROM PipelineStep ORDER BY "order" ASC').all();
const pipelineImages = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80', // Simple talk/briefing
  'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80', // Flat layout drawing
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', // Wood finishing selection
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', // High-tech clean workshop
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', // Tidy checklist
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80', // Stage layout assembly
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80', // Clean organized post-work
];

const updateStep = db.prepare('UPDATE PipelineStep SET bgImageUrl = ? WHERE id = ?');
steps.forEach((step, i) => {
  const img = pipelineImages[i % pipelineImages.length];
  updateStep.run(img, step.id);
  console.log(`✓ Pipeline [${step.title}] updated to simpler picture`);
});

db.close();
console.log('\n✅ All background images updated to clean, high-quality, simpler Unsplash photos!');
