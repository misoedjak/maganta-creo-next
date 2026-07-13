const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const profile = await prisma.companyProfile.findFirst();
  const data = {
    name: "Maganta Kreasi",
    address: "Queen enterprise, Jl. Darussalam 1 No.54, RT.002/RW.005, Cimuning, Kec. Mustika Jaya, Kota Bks, Jawa Barat 17155",
    email: "magantakreasi@gmail.com",
    phone: "Evan Juanito: 0895-3311-05277 / Graciela Clara Santi: 0811-1195-870",
    whatsapp: "62895331105277",
    instagram: "magantakreasi",
  };

  if (profile) {
    await prisma.companyProfile.update({
      where: { id: profile.id },
      data
    });
    console.log("Profile updated!");
  } else {
    await prisma.companyProfile.create({
      data
    });
    console.log("Profile created!");
  }
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
