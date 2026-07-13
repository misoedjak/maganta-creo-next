import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "fs";
import path from "path";

// Initialize Prisma Client with SQLite Adapter pointing to the correct root database
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Adding example portfolio project...");

  // 1. Copy premium mock images from artifacts directory to public/uploads
  const artifactDir = "C:\\Users\\Misael\\.gemini\\antigravity\\brain\\274930a1-0fec-40ef-a02e-c752bb94d3f0";
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const mockImages = [
    "exhibition_booth_1783877929250.jpg",
    "festival_stage_1783877916558.jpg",
    "corporate_seminar_1783877941027.jpg"
  ];

  for (const imgName of mockImages) {
    const srcPath = path.join(artifactDir, imgName);
    const destPath = path.join(uploadDir, imgName);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${imgName} to public/uploads/`);
    } else {
      console.warn(`Source mock image not found: ${srcPath}`);
    }
  }

  // 2. Fetch Category for "Custom Exhibition Booth"
  let category = await prisma.category.findFirst({
    where: { name: { contains: "Exhibition" } }
  });

  if (!category) {
    // Fallback if not found
    category = await prisma.category.findFirst();
  }

  if (!category) {
    throw new Error("No categories found in database. Seed the database first!");
  }

  // 3. Create the portfolio project
  const portfolio = await prisma.portfolio.create({
    data: {
      title: "Mandiri BUMN Expo Custom Double-Deck Booth",
      slug: "mandiri-bumn-expo-custom-double-deck-booth",
      client: "Bank Mandiri",
      categoryId: category.id,
      projectDate: new Date("2026-06-15"),
      location: "JCC Senayan, Jakarta",
      description: "Designed and fabricated a premium custom exhibition booth for Bank Mandiri at the annual BUMN Expo. The design featured a sleek, double-deck structure with integrated LED walls, smooth matte finishes, a private VIP meeting lounge, and custom edge-lit LED acrylic signage. The fabrication was executed within a tight 36-hour load-in window, delivering flawless structural stability and high-end visual appeal that attracted over 10,000 visitors.",
      thumbnail: "/uploads/exhibition_booth_1783877929250.jpg",
      featured: true,
      status: "published",
      seoTitle: "Bank Mandiri Exhibition Booth - JCC Senayan | Maganta Kreasi",
      seoDesc: "Custom double-deck exhibition booth built for Bank Mandiri at BUMN Expo, Jakarta. Flawless structure, premium finish, and integrated LED setup.",
      images: {
        create: [
          { url: "/uploads/exhibition_booth_1783877929250.jpg", order: 0 },
          { url: "/uploads/corporate_seminar_1783877941027.jpg", order: 1 }
        ]
      }
    }
  });

  console.log(`Successfully created portfolio project: "${portfolio.title}"`);
}

main()
  .catch((err) => {
    console.error("Error creating portfolio:", err);
    process.exit(1);
  });
