const Database = require('better-sqlite3');
const db = new Database('E:/myra/maganta-creo-next/dev.db');
const crypto = require('crypto');

const mappings = [
  {
    slug: 'bca-expo-2025-custom-exhibition-booth',
    thumbnail: '/uploads/ai_exhibition_booth_1783936160150.jpg',
    images: ['/uploads/ai_exhibition_booth_1783936160150.jpg']
  },
  {
    slug: 'pertamina-green-energy-exhibition-pavilion',
    thumbnail: '/uploads/bg_exhibition_booth_1783933228042.jpg',
    images: ['/uploads/bg_exhibition_booth_1783933228042.jpg']
  },
  {
    slug: 'telkomsel-5g-digital-launch-main-stage',
    thumbnail: '/uploads/ai_entrance_gate_1783936192005.jpg',
    images: [
      '/uploads/ai_entrance_gate_1783936192005.jpg',
      '/uploads/bg_entrance_gate_1783933264085.jpg'
    ]
  },
  {
    slug: 'hyundai-giias-motor-show-interactive-backdrop',
    thumbnail: '/uploads/ai_event_backdrop_1783936180001.jpg',
    images: [
      '/uploads/ai_event_backdrop_1783936180001.jpg',
      '/uploads/bg_event_backdrop_1783933248514.jpg'
    ]
  },
  {
    slug: 'honda-prospect-motor-show-exhibition-booth',
    thumbnail: '/uploads/exhibition_booth_1783877929250.jpg',
    images: ['/uploads/exhibition_booth_1783877929250.jpg']
  },
  {
    slug: 'astra-annual-gala-dinner-fabrication-stage',
    thumbnail: '/uploads/ai_stage_fabrication_1783936170724.jpg',
    images: [
      '/uploads/ai_stage_fabrication_1783936170724.jpg',
      '/uploads/bg_stage_fabrication_1783933238437.jpg'
    ]
  },
  {
    slug: 'bsi-branch-branding-totems-signages',
    thumbnail: '/uploads/ai_totem_signage_1783936206329.jpg',
    images: [
      '/uploads/ai_totem_signage_1783936206329.jpg',
      '/uploads/bg_totem_signage_1783933275339.jpg'
    ]
  },
  {
    slug: 'pergikuliner-food-festival-custom-booths',
    thumbnail: '/uploads/ai_decorative_installation_1783936216524.jpg',
    images: [
      '/uploads/ai_decorative_installation_1783936216524.jpg',
      '/uploads/bg_decorative_installation_1783933285469.jpg'
    ]
  },
  {
    slug: 'cedea-food-exhibition-showcase-counter',
    thumbnail: '/uploads/ai_branding_area_1783936242784.jpg',
    images: ['/uploads/ai_branding_area_1783936242784.jpg']
  },
  {
    slug: 'iluni-feb-ui-alumni-homecoming-stage',
    thumbnail: '/uploads/ai_festival_decor_1783936233410.jpg',
    images: ['/uploads/ai_festival_decor_1783936233410.jpg']
  }
];

const updatePortfolio = db.prepare('UPDATE Portfolio SET thumbnail = ? WHERE slug = ?');
const deleteImages = db.prepare('DELETE FROM PortfolioImage WHERE portfolioId = ?');
const insertImage = db.prepare('INSERT INTO PortfolioImage (id, portfolioId, url, [order]) VALUES (?, ?, ?, ?)');

db.transaction(() => {
  for (const m of mappings) {
    const portfolio = db.prepare('SELECT id FROM Portfolio WHERE slug = ?').get(m.slug);
    if (portfolio) {
      updatePortfolio.run(m.thumbnail, m.slug);
      deleteImages.run(portfolio.id);
      m.images.forEach((url, index) => {
        insertImage.run(crypto.randomUUID(), portfolio.id, url, index);
      });
    }
  }
})();

console.log('Successfully updated portfolio photos and slideshow images in database!');
