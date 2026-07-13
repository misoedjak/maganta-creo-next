const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const profile = await prisma.companyProfile.findFirst();
  const data = {
    name: "Maganta Kreasi",
    address: "Jakarta, Indonesia",
    email: "hello@magantakreasi.com",
    phone: "+62 812-3456-7890",
    whatsapp: null,
    instagram: null,
  };

  if (profile) {
    await prisma.companyProfile.update({
      where: { id: profile.id },
      data
    });
    console.log("Profile restored!");
  }
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
