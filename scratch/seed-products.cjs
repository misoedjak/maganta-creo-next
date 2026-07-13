const Database = require('better-sqlite3');
const db = new Database('dev.db');

try {
  // Begin transaction
  const insertCategory = db.prepare(`
    INSERT INTO ProductCategory (id, name, slug)
    VALUES (?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET slug=excluded.slug
  `);

  const insertProduct = db.prepare(`
    INSERT INTO Product (id, name, slug, price, priceUnit, description, image, featured, status, categoryId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    ON CONFLICT(slug) DO UPDATE SET
      name=excluded.name,
      price=excluded.price,
      priceUnit=excluded.priceUnit,
      description=excluded.description,
      image=excluded.image
  `);

  // 1. Insert Lighting Category
  const catId = 'cat-lighting-1111';
  insertCategory.run(catId, 'Lighting', 'lighting');
  console.log('Product category "Lighting" seeded.');

  // 2. Insert Products
  const products = [
    {
      id: 'prod-b-eye',
      name: 'B Eye',
      slug: 'b-eye',
      price: 500000,
      priceUnit: 'pcs',
      description: 'Moving Head B-Eye professional stage lighting effect with wash, beam, and graphic features.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
      featured: true,
      status: 'active',
      categoryId: catId
    },
    {
      id: 'prod-follow-spot',
      name: 'Follow Spot - Operator',
      slug: 'follow-spot-operator',
      price: 1000000,
      priceUnit: 'pcs',
      description: 'High-power follow spot light for stage highlights, includes professional stand and operator service.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
      featured: true,
      status: 'active',
      categoryId: catId
    },
    {
      id: 'prod-fresnel',
      name: 'Fresnel',
      slug: 'fresnel',
      price: 400000,
      priceUnit: 'pcs',
      description: 'Classic tungsten Fresnel spotlight providing smooth, even wash lighting for stage environments.',
      image: 'https://images.unsplash.com/photo-1503095391755-111e11837e5c?q=80&w=600&auto=format&fit=crop',
      featured: false,
      status: 'active',
      categoryId: catId
    },
    {
      id: 'prod-fresnel-led',
      name: 'Fresnel LED',
      slug: 'fresnel-led',
      price: 400000,
      priceUnit: 'pcs',
      description: 'Modern energy-efficient LED Fresnel spotlight with adjustable color temperature and soft beam edges.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop',
      featured: false,
      status: 'active',
      categoryId: catId
    },
    {
      id: 'prod-paket-lighting-a',
      name: 'Paket Lighting A',
      slug: 'paket-lighting-a',
      price: 2000000,
      priceUnit: 'package',
      description: 'Basic stage lighting package: 4x LED Par, 2x Halogen, and 1x basic lighting controller.',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
      featured: true,
      status: 'active',
      categoryId: catId
    },
    {
      id: 'prod-paket-lighting-b',
      name: 'Paket Lighting B',
      slug: 'paket-lighting-b',
      price: 3000000,
      priceUnit: 'package',
      description: 'Standard event lighting package: 8x LED Par, 4x Halogen, 2x Beam moving heads, and 1x lighting console.',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop',
      featured: false,
      status: 'active',
      categoryId: catId
    },
    {
      id: 'prod-paket-lighting-c',
      name: 'Paket Lighting C',
      slug: 'paket-lighting-c',
      price: 4500000,
      priceUnit: 'package',
      description: 'Premium event lighting package: 12x LED Par, 4x Beam moving heads, 2x Fresnel LED, smoke machine, and professional console.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
      featured: false,
      status: 'active',
      categoryId: catId
    },
    {
      id: 'prod-paket-lighting-d',
      name: 'Paket Lighting D',
      slug: 'paket-lighting-d',
      price: 6300000,
      priceUnit: 'package',
      description: 'Ultimate concert-grade lighting package: 16x LED Par, 8x Beam moving heads, 4x Fresnel LED, laser effects, hazers, and Tiger Touch DMX console.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop',
      featured: true,
      status: 'active',
      categoryId: catId
    }
  ];

  for (const p of products) {
    insertProduct.run(
      p.id,
      p.name,
      p.slug,
      p.price,
      p.priceUnit,
      p.description,
      p.image,
      p.featured ? 1 : 0,
      p.status,
      p.categoryId
    );
    console.log(`Seeded product: ${p.name}`);
  }

  console.log('Seeding products database complete!');
} catch (error) {
  console.error('Error seeding products:', error);
} finally {
  db.close();
}
