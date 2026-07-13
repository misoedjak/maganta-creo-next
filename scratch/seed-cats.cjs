const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const categoryData = {
  'booth': {
    description: 'Bespoke booth fabrication designed to maximize brand impact and visitor engagement at exhibitions, trade shows, and expos.',
    features: 'Custom Double-Deck Structures, LED & RGB Illumination, CNC Precision Panels, Modular Assembly System, Premium Laminate Finishes, Cable Management Integration'
  },
  'stage': {
    description: 'Massive festival stages and elegant corporate podiums built with structural integrity and engineering precision for any scale event.',
    features: 'Load-Bearing Steel Framework, Integrated Lighting Rigs, Weather-Resistant Materials, Hydraulic Platforms, Sound Isolation Panels, Safety Railings & Barriers'
  },
  'panggung': {
    description: 'Massive festival stages and elegant corporate podiums built with structural integrity and engineering precision for any scale event.',
    features: 'Load-Bearing Steel Framework, Integrated Lighting Rigs, Weather-Resistant Materials, Hydraulic Platforms, Sound Isolation Panels, Safety Railings & Barriers'
  },
  'backdrop': {
    description: 'High-quality scenic backdrops tailored to your event theme, from corporate launches to gala dinners and brand activations.',
    features: 'Full-Color Digital Printing, Tensioned Fabric Systems, Curved & Flat Configurations, Quick-Connect Framing, Fire-Retardant Materials, Seamless Edge Finishing'
  },
  'dekorasi': {
    description: 'Immersive artistic installations and decorative elements that transform any venue into a breathtaking experience.',
    features: 'Custom Artistic Fabrication, Mixed Material Assemblies, Interactive Light Elements, Themed Prop Design, Suspended Installations, On-Site Styling'
  },
  'gate': {
    description: 'Monumental entryways and gate structures that set the tone from the first step, creating unforgettable first impressions.',
    features: 'Architectural Steel Framing, Branded Signage Integration, LED Welcome Lighting, Weather-Proof Coatings, Crowd Flow Engineering, Modular Transport Design'
  },
  'gerbang': {
    description: 'Monumental entryways and gate structures that set the tone from the first step, creating unforgettable first impressions.',
    features: 'Architectural Steel Framing, Branded Signage Integration, LED Welcome Lighting, Weather-Proof Coatings, Crowd Flow Engineering, Modular Transport Design'
  },
  'sign': {
    description: 'Wayfinding and branding totems manufactured with precision for exhibitions, festivals, and large-scale corporate events.',
    features: 'Precision CNC Cutting, Backlit LED Panels, Durable Outdoor Materials, Custom Typography, Directional Mapping Design, Quick-Install Mounting'
  },
  'totem': {
    description: 'Wayfinding and branding totems manufactured with precision for exhibitions, festivals, and large-scale corporate events.',
    features: 'Precision CNC Cutting, Backlit LED Panels, Durable Outdoor Materials, Custom Typography, Directional Mapping Design, Quick-Install Mounting'
  },
  'branding': {
    description: 'Comprehensive branding area fabrication designed to showcase your identity with maximum visual impact across any event space.',
    features: 'Custom Brand Wall Design, Vinyl & Digital Wrapping, Illuminated Logo Displays, Product Showcase Fixtures, Interactive Touchpoints, Consistent Brand Theming'
  },
};

async function main() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  console.log(`Found ${categories.length} categories:\n`);

  for (const cat of categories) {
    const slug = cat.slug.toLowerCase();

    // Find matching data by checking if slug contains any keyword
    let matchedData = null;
    for (const [keyword, data] of Object.entries(categoryData)) {
      if (slug.includes(keyword)) {
        matchedData = data;
        break;
      }
    }

    if (!matchedData) {
      // Fallback generic description
      matchedData = {
        description: `Professional ${cat.name.toLowerCase()} fabrication and installation services tailored for exhibitions, corporate events, and large-scale productions.`,
        features: 'Custom Design Fitting, Premium Materials, On-Time Assembly, Structural Load Calculations, Professional Installation, Quality Finishing'
      };
    }

    // Only update if description or features are currently empty
    if (!cat.description || !cat.features) {
      await prisma.category.update({
        where: { id: cat.id },
        data: {
          description: cat.description || matchedData.description,
          features: cat.features || matchedData.features,
        }
      });
      console.log(`✅ Updated: ${cat.name} (${cat.slug})`);
    } else {
      console.log(`⏭️  Skipped: ${cat.name} (already has data)`);
    }
  }

  console.log('\nDone!');
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
