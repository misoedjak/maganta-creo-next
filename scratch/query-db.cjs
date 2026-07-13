const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const [categories, advantages, pipelineSteps] = await Promise.all([
    p.category.findMany({ orderBy: { name: 'asc' } }),
    p.advantage.findMany({ orderBy: { order: 'asc' } }),
    p.pipelineStep.findMany({ orderBy: { order: 'asc' } }),
  ]);

  console.log('CATEGORIES:', JSON.stringify(categories.map(x => ({ id: x.id, name: x.name }))));
  console.log('ADVANTAGES:', JSON.stringify(advantages.map(x => ({ id: x.id, title: x.title }))));
  console.log('PIPELINE:', JSON.stringify(pipelineSteps.map(x => ({ id: x.id, title: x.title }))));
}

main().catch(console.error).finally(() => p.$disconnect());
