const { PrismaClient } = require("../node_modules/@prisma/client");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        "postgresql://postgres:postgres@localhost:5432/it_roadmap",
    },
  },
});

async function main() {
  try {
    // Create an admin user if not exists
    const adminUser = await prisma.user.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        username: "admin",
        email: "admin@example.com",
        password:
          "$2b$10$EGnlcK4ZBqTuI9kZJgaIw.XsLNqJR0DEXE4CxIwSaVlBZawUxCOP.", // hashed 'admin123'
        isAdmin: true,
      },
    });
    console.log("Admin user ready:", adminUser.id);

    // Create categories
    const htmlCssCategory = await prisma.category.upsert({
      where: { name: "HTML and CSS" },
      update: {},
      create: {
        name: "HTML and CSS",
        color: "#0A7029",
        description: "Web markup and styling fundamentals",
      },
    });

    const jsCategory = await prisma.category.upsert({
      where: { name: "JavaScript" },
      update: {},
      create: {
        name: "JavaScript",
        color: "#F7DF1E",
        description: "Client-side programming language for web development",
      },
    });

    console.log("Created categories");

    // Create skills
    const htmlSkill = await prisma.skill.upsert({
      where: { name: "HTML" },
      update: {},
      create: {
        name: "HTML",
        type: "markup",
        description: "The standard markup language for Web pages",
      },
    });

    const cssSkill = await prisma.skill.upsert({
      where: { name: "CSS" },
      update: {},
      create: {
        name: "CSS",
        type: "styling",
        description: "The language for styling web pages",
      },
    });

    const jsSkill = await prisma.skill.upsert({
      where: { name: "JavaScript" },
      update: {},
      create: {
        name: "JavaScript",
        type: "programming",
        description: "The programming language of the Web",
      },
    });

    console.log("Created skills");

    // Create tags
    const beginnerTag = await prisma.tag.upsert({
      where: { name: "Beginner" },
      update: {},
      create: { name: "Beginner", color: "#4CAF50" },
    });

    const webDevTag = await prisma.tag.upsert({
      where: { name: "Web Development" },
      update: {},
      create: { name: "Web Development", color: "#E91E63" },
    });

    console.log("Created tags");

    // Create HTML Course
    const htmlCourse = await prisma.course.create({
      data: {
        title: "Introduction to HTML",
        code: "HTML-INTRO-001",
        description:
          "Learn the basics of HTML, the standard markup language for Web pages.",
        url: "https://example.com/courses/html-intro",
        content:
          "# Introduction to HTML\n\nHTML is the standard markup language for creating Web pages.",
        categoryId: htmlCssCategory.id,
        skillId: htmlSkill.id,
      },
    });

    console.log("Created courses");

    // Create basic roadmap
    const roadmap = await prisma.roadmap.create({
      data: {
        title: "Frontend Web Developer Path",
        description:
          "Complete learning path to become a frontend web developer",
        categoryId: htmlCssCategory.id,
        userId: adminUser.id,
        nodesData: JSON.stringify([
          {
            id: "node-1",
            position: { x: 100, y: 100 },
            data: { label: "HTML Fundamentals" },
          },
        ]),
        edgesData: JSON.stringify([]),
      },
    });

    console.log("Created roadmap");

    // Link roadmap with tags
    await prisma.roadmapTag.create({
      data: {
        roadmapId: roadmap.id,
        tagId: beginnerTag.id,
      },
    });

    await prisma.roadmapTag.create({
      data: {
        roadmapId: roadmap.id,
        tagId: webDevTag.id,
      },
    });

    console.log("✅ W3Schools-like educational content imported successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Print environment info
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("CWD:", process.cwd());

main()
  .then(() => console.log("Done!"))
  .catch((e) => {
    console.error("Import failed:", e);
    process.exit(1);
  });
