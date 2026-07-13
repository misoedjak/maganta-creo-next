const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear any existing values to avoid duplicates
  await prisma.advantage.deleteMany({});
  await prisma.pipelineStep.deleteMany({});

  console.log("Existing advantages and pipeline steps cleared.");

  // Seed advantages
  const advantages = [
    { title: "In-House Workshop", description: "Complete control over quality and timelines with our fully-equipped fabrication facility.", icon: "Hammer", order: 0 },
    { title: "Premium Materials", description: "We source only high-grade materials to ensure structural safety and aesthetic perfection.", icon: "ShieldCheck", order: 1 },
    { title: "3D Prototyping", description: "Visualize your setup before we build it with our expert 3D rendering and design team.", icon: "PenTool", order: 2 },
    { title: "Precision Engineering", description: "Every joint and truss is engineered for maximum load-bearing safety.", icon: "Drill", order: 3 },
    { title: "On-Time Build", description: "Strict adherence to production schedules and venue bump-in times.", icon: "Clock", order: 4 },
    { title: "Nationwide Deployment", description: "Capable of manufacturing in Jakarta and deploying anywhere across Indonesia.", icon: "Map", order: 5 }
  ];

  for (const item of advantages) {
    await prisma.advantage.create({ data: item });
  }
  console.log(`Seeded ${advantages.length} advantages.`);

  // Seed pipeline steps
  const steps = [
    { title: "Consultation & Briefing", description: "Understanding your brand vision, space constraints, and budget.", order: 0 },
    { title: "3D Design & Rendering", description: "Providing photorealistic mockups and structural floor plans.", order: 1 },
    { title: "Material Selection", description: "Sourcing the exact wood, metal, and finishes required.", order: 2 },
    { title: "Workshop Fabrication", description: "Carpentry, metalwork, and painting at our dedicated facility.", order: 3 },
    { title: "Quality Control Setup", description: "Pre-assembling complex structures in our workshop to guarantee fit.", order: 4 },
    { title: "On-site Installation", description: "Safe, rapid bump-in and construction at the event venue.", order: 5 },
    { title: "Dismantling", description: "Clean teardown and logistics removal post-event.", order: 6 }
  ];

  for (const item of steps) {
    await prisma.pipelineStep.create({ data: item });
  }
  console.log(`Seeded ${steps.length} pipeline steps.`);
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
