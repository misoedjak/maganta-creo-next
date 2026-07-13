const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear any existing records to prevent duplication
  await prisma.heroSettings.deleteMany({});
  await prisma.aboutSettings.deleteMany({});
  await prisma.statCard.deleteMany({});
  console.log("Existing homepage settings and stat card records cleared.");

  // 1. Seed Hero Settings
  await prisma.heroSettings.create({
    data: {
      heading: "Premium Event Fabrication & Design.",
      subheading: "Premium Event Fabrication & Decoration Solutions. From Custom Exhibition Booths to Massive Festival Stages.",
      bgImageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop",
      ctaText: "Get a Quote",
      ctaLink: "#contact",
      portfolioText: "View Portfolio",
      portfolioLink: "#portfolio"
    }
  });
  console.log("Seeded default Hero Settings.");

  // 2. Seed About Settings
  await prisma.aboutSettings.create({
    data: {
      heading: "Precision Engineering, Exceptional Craftsmanship.",
      paragraph1: "Maganta Kreasi is Indonesia's premier event fabrication and decoration specialist. We bring visionary event designs to life with unparalleled structural integrity and aesthetic perfection.",
      paragraph2: "Operating from our massive in-house workshop, our team of structural engineers, carpenters, and visual artists craft bespoke exhibition booths, monumental festival stages, and immersive corporate event environments.",
      features: "In-house Fabrication Workshop, Premium Structural Materials, Dedicated Project Managers"
    }
  });
  console.log("Seeded default About Settings.");

  // 3. Seed Stat Cards
  const stats = [
    { number: "500+", label: "Fabrications Completed", order: 0 },
    { number: "Top", label: "Corporate Clients", order: 1 },
    { number: "In-House", label: "Production Workshop", order: 2 },
    { number: "100%", label: "Nationwide Service", order: 3 }
  ];

  for (const s of stats) {
    await prisma.statCard.create({ data: s });
  }
  console.log("Seeded default Stat Cards.");

  console.log("Homepage seeding completed successfully!");
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
