const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const fs = require('fs');
const path = require('path');

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.client.deleteMany({});
  console.log("Existing clients database records cleared.");

  // Ensure uploads directory exists
  const logoDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
  if (!fs.existsSync(logoDir)) {
    fs.mkdirSync(logoDir, { recursive: true });
  }

  const clients = [
    { name: "Bank Mandiri", color: "#1c3f60", order: 0, event: "BUMN Expo 2025", type: "Custom Double-Deck Booth", feedback: "Maganta Kreasi delivered an outstanding double-deck structure that was both structurally sound and visually striking. Their workshop capabilities allowed for adjustments during design refinement.", stat: "10,000+ Visitors" },
    { name: "BCA", color: "#00509d", order: 1 },
    { name: "Pertamina", color: "#2b9348", order: 2 },
    { name: "Telkomsel", color: "#e63946", order: 3, event: "Digital Lifestyle Award 2025", type: "Monumental Entrance Gate & Stage", feedback: "The RGB illumination integration and CNC precision mapping on the entrance gates were flawless. They finished assembly 4 hours before the strict security lock-down.", stat: "36-hour build" },
    { name: "Hyundai", color: "#002c59", order: 4, event: "GIIAS Motor Show 2025", type: "Exhibition Backdrop & Totems", feedback: "Clean visual joints, anti-glare matte coating, and perfect branding color matching. Highly recommended for automotive booths where finishes are inspected closely.", stat: "Zero-defect finish" },
    { name: "Honda Prospect", color: "#d90429", order: 5 },
    { name: "Astra International", color: "#1d3557", order: 6 },
    { name: "BSI", color: "#007f5f", order: 7 },
    { name: "Sampoerna", color: "#b7094c", order: 8 },
    { name: "Sinarmas Land", color: "#fb8500", order: 9 },
    { name: "XL Axiata", color: "#00509d", order: 10 },
    { name: "PTBA", color: "#fb8500", order: 11 },
    { name: "Akurat.co", color: "#0077b6", order: 12 },
    { name: "Coca-Cola", color: "#e63946", order: 13 },
    { name: "PwC", color: "#e65f2b", order: 14 },
    { name: "UIMF", color: "#2b2d42", order: 15 },
    { name: "PergiKuliner", color: "#d90429", order: 16 },
    { name: "Cedea", color: "#9b2226", order: 17 },
    { name: "Iluni FEB UI", color: "#ca8a04", order: 18 }
  ];

  for (const c of clients) {
    // Generate styled SVG logo representation
    const svgFileName = `${c.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
    const svgFilePath = path.join(logoDir, svgFileName);
    
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <rect width="100%" height="100%" fill="none" />
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="22" fill="${c.color}">${c.name}</text>
</svg>`;

    fs.writeFileSync(svgFilePath, svgContent);
    const logoUrl = `/uploads/logos/${svgFileName}`;

    await prisma.client.create({
      data: {
        name: c.name,
        logoUrl: logoUrl,
        order: c.order,
        event: c.event || null,
        type: c.type || null,
        feedback: c.feedback || null,
        stat: c.stat || null
      }
    });
  }

  console.log(`Seeded ${clients.length} clients in database with generated SVG logos.`);
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
