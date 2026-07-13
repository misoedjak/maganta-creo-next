import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Create Super Admin User
  const adminEmail = "admin@magantakreasi.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const superAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Super Admin",
        role: "SUPER_ADMIN",
      },
    });
    console.log(`Created Super Admin user: ${superAdmin.email}`);
  } else {
    console.log("Super Admin user already exists.");
  }

  // 2. Create Categories
  const categoriesToSeed = [
    { name: "Custom Exhibition Booth", slug: "custom-exhibition-booth" },
    { name: "Stage Fabrication", slug: "stage-fabrication" },
    { name: "Event Backdrop", slug: "event-backdrop" },
    { name: "Entrance Gate", slug: "entrance-gate" },
    { name: "Totem & Signage", slug: "totem-signage" },
    { name: "Decorative Installation", slug: "decorative-installation" },
    { name: "Festival Decoration", slug: "festival-decoration" },
    { name: "Branding Area", slug: "branding-area" },
  ];

  for (const cat of categoriesToSeed) {
    const existingCat = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });

    if (!existingCat) {
      await prisma.category.create({
        data: cat,
      });
      console.log(`Created category: ${cat.name}`);
    }
  }

  // 3. Create Default Company Profile
  const profileCount = await prisma.companyProfile.count();
  if (profileCount === 0) {
    await prisma.companyProfile.create({
      data: {
        name: "Maganta Kreasi",
        description: "Event Fabrication & Decoration Solutions. Standard and Custom Exhibition Booths, Stages, Backdrops, Entrances, Totems, and Decorative Installations.",
        vision: "Menjadi mitra terpercaya dalam fabrikasi dan dekorasi event dengan kualitas premium di Indonesia.",
        mission: "Memberikan layanan fabrikasi presisi tinggi, material berkualitas, desain 3D akurat, dan pengerjaan tepat waktu demi kesuksesan event klien.",
        address: "Workshop Maganta Kreasi, Jakarta, Indonesia",
        phone: "+62 812-3456-7890",
        email: "info@magantakreasi.com",
        whatsapp: "6281234567890",
        instagram: "magantakreasi",
      },
    });
    console.log("Created default company profile.");
  }

  // 4. Create Default Settings
  const settingsCount = await prisma.settings.count();
  if (settingsCount === 0) {
    await prisma.settings.create({
      data: {
        siteName: "Maganta Kreasi",
        seoTitle: "Maganta Kreasi - Premium Event Fabrication & Decoration",
        seoDesc: "Jasa fabrikasi booth pameran, panggung event, backdrop dekorasi, gate masuk, dan signage berkualitas tinggi untuk kesuksesan event Anda.",
      },
    });
    console.log("Created default settings.");
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
