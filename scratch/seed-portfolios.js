const Database = require('better-sqlite3');
const db = new Database('E:/myra/maganta-creo-next/dev.db');
const crypto = require('crypto');

const portfolios = [
  {
    title: 'BCA Expo 2025 Custom Exhibition Booth',
    slug: 'bca-expo-2025-custom-exhibition-booth',
    client: 'BCA',
    categoryId: '68223447-0226-413c-8894-052cf9f0b17e',
    description: 'Premium custom exhibition booth designed and fabricated for BCA Expo 2025, featuring interactive digital counters and custom corporate lighting.',
    thumbnail: '/uploads/exhibition_booth_1783877929250.jpg',
    status: 'published',
    projectDate: '2025-06-15T00:00:00.000Z',
    location: 'ICE BSD, Tangerang'
  },
  {
    title: 'Pertamina Green Energy Exhibition Pavilion',
    slug: 'pertamina-green-energy-exhibition-pavilion',
    client: 'Pertamina',
    categoryId: '68223447-0226-413c-8894-052cf9f0b17e',
    description: 'Sustainable exhibition pavilion created for Pertamina, highlighting renewable energy solutions with eco-friendly wood fabrication and low-emission materials.',
    thumbnail: '/uploads/exhibition_booth_1783877929250.jpg',
    status: 'published',
    projectDate: '2025-08-20T00:00:00.000Z',
    location: 'JCC Senayan, Jakarta'
  },
  {
    title: 'Telkomsel 5G Digital Launch Main Stage',
    slug: 'telkomsel-5g-digital-launch-main-stage',
    client: 'Telkomsel',
    categoryId: 'b07f3327-f95b-4cd2-a226-3f793845643f',
    description: 'High-end massive stage fabrication featuring custom geometric design elements, built-in RGB LED strip mapping, and CNC-precision backing panels.',
    thumbnail: '/uploads/festival_stage_1783877916558.jpg',
    status: 'published',
    projectDate: '2025-09-10T00:00:00.000Z',
    location: 'Telkom Landmark Tower, Jakarta'
  },
  {
    title: 'Hyundai GIIAS Motor Show Interactive Backdrop',
    slug: 'hyundai-giias-motor-show-interactive-backdrop',
    client: 'Hyundai',
    categoryId: '9ca087ae-f0cb-4fed-bed7-07c7e7d18551',
    description: 'Seamless double-wide backdrop with anti-glare matte finishes and custom acrylic showcase compartments built for GIIAS Motor Show.',
    thumbnail: '/uploads/corporate_seminar_1783877941027.jpg',
    status: 'published',
    projectDate: '2025-07-22T00:00:00.000Z',
    location: 'ICE BSD, Tangerang'
  },
  {
    title: 'Honda Prospect Motor Show Exhibition Booth',
    slug: 'honda-prospect-motor-show-exhibition-booth',
    client: 'Honda Prospect',
    categoryId: '68223447-0226-413c-8894-052cf9f0b17e',
    description: 'Premium automotive exhibition booth with glossy finishes, elevated platform, and high-intensity overhead lighting grids.',
    thumbnail: '/uploads/exhibition_booth_1783877929250.jpg',
    status: 'published',
    projectDate: '2025-07-22T00:00:00.000Z',
    location: 'ICE BSD, Tangerang'
  },
  {
    title: 'Astra Annual Gala Dinner Fabrication & Stage',
    slug: 'astra-annual-gala-dinner-fabrication-stage',
    client: 'Astra International',
    categoryId: 'b07f3327-f95b-4cd2-a226-3f793845643f',
    description: 'Elegant stage production featuring multi-tier staging platforms, high-gloss black vinyl flooring, and decorative golden structures.',
    thumbnail: '/uploads/festival_stage_1783877916558.jpg',
    status: 'published',
    projectDate: '2025-11-05T00:00:00.000Z',
    location: 'Ritz-Carlton Pacific Place, Jakarta'
  },
  {
    title: 'BSI Branch Branding Totems & Signages',
    slug: 'bsi-branch-branding-totems-signages',
    client: 'BSI',
    categoryId: '97924fa0-47af-4833-b241-e75a469bbb51',
    description: 'Nationwide roll-out of brand identity signs and external totem signages fabricated with CNC-milled steel frames and energy-efficient LED modules.',
    thumbnail: '/uploads/corporate_seminar_1783877941027.jpg',
    status: 'published',
    projectDate: '2025-10-18T00:00:00.000Z',
    location: 'Jakarta, Indonesia'
  },
  {
    title: 'PergiKuliner Food Festival Custom Booths',
    slug: 'pergikuliner-food-festival-custom-booths',
    client: 'PergiKuliner',
    categoryId: 'a1208f49-27de-4e86-84c6-7e3d75587043',
    description: 'A collection of modular and highly-branded food stalls fabricated with durable plywood structures and vibrant custom paint jobs.',
    thumbnail: '/uploads/festival_stage_1783877916558.jpg',
    status: 'published',
    projectDate: '2025-05-12T00:00:00.000Z',
    location: 'Kota Kasablanka, Jakarta'
  },
  {
    title: 'Cedea Food Exhibition Showcase Counter',
    slug: 'cedea-food-exhibition-showcase-counter',
    client: 'Cedea',
    categoryId: '6517ade3-5d1f-4d88-b373-cd90153089c9',
    description: 'Food service showcase counter featuring customized refrigeration panel integration, hygienic acrylic shields, and internal spotlighting.',
    thumbnail: '/uploads/exhibition_booth_1783877929250.jpg',
    status: 'published',
    projectDate: '2025-04-30T00:00:00.000Z',
    location: 'PRJ Kemayoran, Jakarta'
  },
  {
    title: 'Iluni FEB UI Alumni Homecoming Stage',
    slug: 'iluni-feb-ui-alumni-homecoming-stage',
    client: 'Iluni FEB UI',
    categoryId: 'b07f3327-f95b-4cd2-a226-3f793845643f',
    description: 'Alumni homecoming music stage featuring lightweight aluminum truss assemblies and customized brand decals representing the ILUNI identity.',
    thumbnail: '/uploads/festival_stage_1783877916558.jpg',
    status: 'published',
    projectDate: '2025-12-20T00:00:00.000Z',
    location: 'FEB UI Campus, Depok'
  }
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO Portfolio 
  (id, title, slug, client, categoryId, description, thumbnail, status, projectDate, location, seoTitle, seoDesc, createdAt, updatedAt) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertImage = db.prepare(`
  INSERT OR IGNORE INTO PortfolioImage (id, portfolioId, url, [order]) VALUES (?, ?, ?, ?)
`);

db.transaction(() => {
  for (const p of portfolios) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    insert.run(
      id,
      p.title,
      p.slug,
      p.client,
      p.categoryId,
      p.description,
      p.thumbnail,
      p.status,
      p.projectDate,
      p.location,
      p.title,
      p.description,
      now,
      now
    );
    insertImage.run(crypto.randomUUID(), id, p.thumbnail, 0);
  }
})();

console.log('Successfully inserted all new portfolios!');
