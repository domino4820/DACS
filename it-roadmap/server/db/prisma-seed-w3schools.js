const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create categories
    console.log('Creating categories...');
    const htmlCssCategory = await prisma.category.upsert({
      where: { name: 'HTML and CSS' },
      update: {},
      create: { name: 'HTML and CSS', color: '#0A7029', description: 'Web markup and styling fundamentals' }
    });

    // Create skills
    console.log('Creating skills...');
    const htmlSkill = await prisma.skill.upsert({
      where: { name: 'HTML' },
      update: {},
      create: { name: 'HTML', type: 'markup', description: 'The standard markup language for Web pages' }
    });

    // Create tags
    console.log('Creating tags...');
    await prisma.tag.upsert({
      where: { name: 'Beginner' },
      update: {},
      create: { name: 'Beginner', color: '#4CAF50' }
    });

    console.log('W3Schools-like content imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await prisma.();
  }
}

main().catch(console.error);