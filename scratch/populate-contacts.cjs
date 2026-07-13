const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../dev.db');
const db = new Database(dbPath);

console.log('Populating contacts in SQLite Database at:', dbPath);

// Fetch existing profile or insert default
const profile = db.prepare('SELECT id FROM CompanyProfile').get();

const data = {
  address: 'Queen enterprise, Jl. Darussalam 1 No.54, RT.002/RW.005, Cimuning, Kec. Mustika Jaya, Kota Bks, Jawa Barat 17155',
  phoneName: 'Evan Juanito',
  phone: '0895-3311-05277',
  phone2Name: 'Graciela Clara Santi',
  phone2: '0811-1195-870',
  whatsappName: 'Evan Juanito',
  whatsapp: '0895-3311-05277',
  whatsapp2Name: 'Graciela Clara Santi',
  whatsapp2: '0811-1195-870',
  email: 'magantakreasi@gmail.com',
  updatedAt: new Date().toISOString()
};

if (profile) {
  // Update
  const stmt = db.prepare(`
    UPDATE CompanyProfile 
    SET address = ?, phoneName = ?, phone = ?, phone2Name = ?, phone2 = ?, 
        whatsappName = ?, whatsapp = ?, whatsapp2Name = ?, whatsapp2 = ?, 
        email = ?, updatedAt = ?
    WHERE id = ?
  `);
  stmt.run(
    data.address,
    data.phoneName,
    data.phone,
    data.phone2Name,
    data.phone2,
    data.whatsappName,
    data.whatsapp,
    data.whatsapp2Name,
    data.whatsapp2,
    data.email,
    data.updatedAt,
    profile.id
  );
  console.log('✓ Successfully updated existing Company Profile.');
} else {
  // Insert
  const stmt = db.prepare(`
    INSERT INTO CompanyProfile (id, name, description, address, phoneName, phone, phone2Name, phone2, whatsappName, whatsapp, whatsapp2Name, whatsapp2, email, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    'default-id',
    'Maganta Kreasi',
    'Event Fabrication & Decoration Solutions.',
    data.address,
    data.phoneName,
    data.phone,
    data.phone2Name,
    data.phone2,
    data.whatsappName,
    data.whatsapp,
    data.whatsapp2Name,
    data.whatsapp2,
    data.email,
    data.updatedAt
  );
  console.log('✓ Successfully inserted new Company Profile.');
}

db.close();
console.log('✅ Done! Contact information seeded successfully.');
