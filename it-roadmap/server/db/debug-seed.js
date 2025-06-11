const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  try {
    console.log("Starting database seeding...");

    // Create admin user
    console.log("Creating admin user...");
    const adminUser = await prisma.user.upsert({
      where: { username: "w3admin" },
      update: {},
      create: {
        username: "w3admin",
        email: "w3admin@example.com",
        password:
          "$2b$10$EGnlcK4ZBqTuI9kZJgaIw.XsLNqJR0DEXE4CxIwSaVlBZawUxCOP.", // hashed 'admin123'
        isAdmin: true,
      },
    });
    console.log("Admin user created:", adminUser.id);

    // Create category
    console.log("Creating category...");
    const category = await prisma.category.upsert({
      where: { name: "W3Schools HTML" },
      update: {},
      create: {
        name: "W3Schools HTML",
        color: "#0A7029",
        description: "HTML tutorials from W3Schools",
      },
    });
    console.log("Category created:", category.id);

    // Create skill
    console.log("Creating skill...");
    const skill = await prisma.skill.upsert({
      where: { name: "W3Schools HTML Skill" },
      update: {},
      create: {
        name: "W3Schools HTML Skill",
        type: "markup",
        description: "HTML skills from W3Schools",
      },
    });
    console.log("Skill created:", skill.id);

    // Create tag
    console.log("Creating tag...");
    const tag = await prisma.tag.upsert({
      where: { name: "W3Schools" },
      update: {},
      create: {
        name: "W3Schools",
        color: "#4CAF50",
      },
    });
    console.log("Tag created:", tag.id);

    // Create roadmap
    console.log("Creating roadmap...");

    // First check if roadmap exists
    const existingRoadmap = await prisma.roadmap.findFirst({
      where: {
        title: "W3Schools HTML Path",
        userId: adminUser.id,
      },
    });

    let roadmap;
    if (existingRoadmap) {
      console.log("Roadmap already exists, updating...");
      roadmap = await prisma.roadmap.update({
        where: { id: existingRoadmap.id },
        data: {
          description: "Learn HTML the W3Schools way - updated",
          nodesData: JSON.stringify([
            {
              id: "node-1",
              position: { x: 100, y: 100 },
              data: { label: "HTML Basics" },
            },
          ]),
          edgesData: JSON.stringify([]),
        },
      });
    } else {
      roadmap = await prisma.roadmap.create({
        data: {
          title: "W3Schools HTML Path",
          description: "Learn HTML the W3Schools way",
          categoryId: category.id,
          skillId: skill.id,
          userId: adminUser.id,
          nodesData: JSON.stringify([
            {
              id: "node-1",
              position: { x: 100, y: 100 },
              data: { label: "HTML Basics" },
            },
          ]),
          edgesData: JSON.stringify([]),
        },
      });
    }
    console.log("Roadmap created/updated:", roadmap.id);

    // Create course
    console.log("Creating course...");
    const course = await prisma.course.upsert({
      where: { code: "W3-HTML-001" },
      update: {},
      create: {
        title: "W3Schools HTML Course",
        code: "W3-HTML-001",
        description: "Learn HTML from W3Schools",
        content:
          "# HTML Tutorial\n\nHTML is the standard markup language for Web pages.",
        categoryId: category.id,
        skillId: skill.id,
      },
    });
    console.log("Course created:", course.id);

    // Link roadmap and tag
    console.log("Linking roadmap and tag...");

    // Check if the link already exists
    const existingRoadmapTag = await prisma.roadmapTag
      .findUnique({
        where: {
          roadmapId_tagId: {
            roadmapId: roadmap.id,
            tagId: tag.id,
          },
        },
      })
      .catch(() => null); // If it doesn't exist, catch the error and return null

    if (!existingRoadmapTag) {
      await prisma.roadmapTag.create({
        data: {
          roadmapId: roadmap.id,
          tagId: tag.id,
        },
      });
      console.log("Roadmap and tag linked");
    } else {
      console.log("Roadmap and tag already linked");
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("ERROR DURING SEEDING:", error);
    if (error.meta) {
      console.error("Meta information:", error.meta);
    }
  } finally {
    await prisma.$disconnect();
    console.log("Database connection closed");
  }
}

main()
  .then(() => console.log("Done!"))
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  });
