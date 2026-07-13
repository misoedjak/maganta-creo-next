const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../dev.db');
const db = new Database(dbPath);

console.log('--- CATEGORIES ---');
db.prepare('SELECT name, slug, bgImageUrl FROM Category').all().forEach(c => {
  console.log(`Name: ${c.name} | Slug: ${c.slug} | Image: ${c.bgImageUrl}`);
});

console.log('\n--- ADVANTAGES ---');
db.prepare('SELECT title, bgImageUrl FROM Advantage').all().forEach(a => {
  console.log(`Title: ${a.title} | Image: ${a.bgImageUrl}`);
});

console.log('\n--- PIPELINE STEPS ---');
db.prepare('SELECT title, bgImageUrl FROM PipelineStep').all().forEach(s => {
  console.log(`Title: ${s.title} | Image: ${s.bgImageUrl}`);
});

db.close();
