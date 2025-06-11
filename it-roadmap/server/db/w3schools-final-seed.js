const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * W3Schools-like educational content for IT Roadmap Application
 * This script populates the database with educational content similar to W3Schools
 */
async function main() {
  try {
    console.log("Starting W3Schools data import...");

    // Create admin user if not exists
    let adminUser = await prisma.user.findUnique({
      where: { username: "w3admin" },
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          username: "w3admin",
          email: "w3admin@example.com",
          password:
            "$2b$10$EGnlcK4ZBqTuI9kZJgaIw.XsLNqJR0DEXE4CxIwSaVlBZawUxCOP.", // hashed 'admin123'
          isAdmin: true,
        },
      });
      console.log("Created admin user");
    } else {
      console.log("Admin user already exists:", adminUser.id);
    }

    // Categories (Main learning areas from W3Schools)
    const categories = [
      {
        name: "HTML and CSS",
        color: "#0A7029",
        description: "Web markup and styling fundamentals",
      },
      {
        name: "JavaScript",
        color: "#F7DF1E",
        description: "Client-side programming language for web development",
      },
      {
        name: "Backend",
        color: "#3776AB",
        description: "Server-side programming and database management",
      },
      {
        name: "Data Analytics",
        color: "#FF6F00",
        description: "Data processing, analysis and visualization",
      },
      {
        name: "Web Building",
        color: "#4CAF50",
        description: "Comprehensive web development and deployment",
      },
    ];

    console.log("Creating categories...");
    const createdCategories = {};
    for (const category of categories) {
      const result = await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
      createdCategories[category.name] = result;
      console.log(`- Created category: ${category.name}`);
    }

    // Skills (Programming languages and technologies)
    const skills = [
      {
        name: "HTML",
        type: "markup",
        description: "The standard markup language for Web pages",
      },
      {
        name: "CSS",
        type: "styling",
        description: "The language for styling web pages",
      },
      {
        name: "JavaScript",
        type: "programming",
        description: "The programming language of the Web",
      },
      {
        name: "Python",
        type: "programming",
        description: "A popular programming language for backend development",
      },
      {
        name: "SQL",
        type: "database",
        description: "Structured Query Language for database management",
      },
      {
        name: "React",
        type: "framework",
        description: "A JavaScript library for building user interfaces",
      },
      {
        name: "Bootstrap",
        type: "framework",
        description: "Popular CSS framework for responsive websites",
      },
      {
        name: "Node.js",
        type: "runtime",
        description: "JavaScript runtime for server-side programming",
      },
    ];

    console.log("Creating skills...");
    const createdSkills = {};
    for (const skill of skills) {
      const result = await prisma.skill.upsert({
        where: { name: skill.name },
        update: {},
        create: skill,
      });
      createdSkills[skill.name] = result;
      console.log(`- Created skill: ${skill.name}`);
    }

    // Tags (keywords for content categorization)
    const tags = [
      { name: "Beginner", color: "#4CAF50" },
      { name: "Intermediate", color: "#2196F3" },
      { name: "Advanced", color: "#F44336" },
      { name: "Web Development", color: "#E91E63" },
      { name: "Frontend", color: "#3F51B5" },
      { name: "Backend", color: "#00BCD4" },
      { name: "Database", color: "#8BC34A" },
      { name: "Tutorial", color: "#9C27B0" },
      { name: "Reference", color: "#FF9800" },
      { name: "W3Schools", color: "#4CAF50" },
    ];

    console.log("Creating tags...");
    const createdTags = {};
    for (const tag of tags) {
      const result = await prisma.tag.upsert({
        where: { name: tag.name },
        update: {},
        create: tag,
      });
      createdTags[tag.name] = result;
      console.log(`- Created tag: ${tag.name}`);
    }

    // Courses
    const courses = [
      {
        title: "HTML Fundamentals",
        code: "W3-HTML-101",
        description:
          "Learn the basics of HTML, the standard markup language for Web pages.",
        content:
          "# HTML Tutorial\n\nHTML is the standard markup language for Web pages. With HTML you can create your own website.",
        categoryName: "HTML and CSS",
        skillName: "HTML",
        tagNames: [
          "Beginner",
          "Web Development",
          "Frontend",
          "Tutorial",
          "W3Schools",
        ],
      },
      {
        title: "CSS Styling",
        code: "W3-CSS-101",
        description:
          "Learn CSS to style your HTML documents with beautiful designs.",
        content:
          "# CSS Tutorial\n\nCSS is the language we use to style an HTML document. CSS describes how HTML elements should be displayed.",
        categoryName: "HTML and CSS",
        skillName: "CSS",
        tagNames: [
          "Beginner",
          "Web Development",
          "Frontend",
          "Tutorial",
          "W3Schools",
        ],
      },
      {
        title: "JavaScript Essentials",
        code: "W3-JS-101",
        description: "Learn JavaScript, the programming language of the Web.",
        content:
          "# JavaScript Tutorial\n\nJavaScript is the world's most popular programming language. JavaScript is the programming language of the Web.",
        categoryName: "JavaScript",
        skillName: "JavaScript",
        tagNames: [
          "Beginner",
          "Web Development",
          "Frontend",
          "Tutorial",
          "W3Schools",
        ],
      },
      {
        title: "Python Programming",
        code: "W3-PY-101",
        description:
          "Learn Python, one of the most popular programming languages in the world.",
        content:
          "# Python Tutorial\n\nPython is a popular programming language. It was created by Guido van Rossum, and released in 1991.",
        categoryName: "Backend",
        skillName: "Python",
        tagNames: ["Beginner", "Backend", "Tutorial", "W3Schools"],
      },
      {
        title: "SQL Database",
        code: "W3-SQL-101",
        description: "Learn SQL to manage and query databases.",
        content:
          "# SQL Tutorial\n\nSQL is a standard language for storing, manipulating and retrieving data in databases.",
        categoryName: "Backend",
        skillName: "SQL",
        tagNames: ["Beginner", "Database", "Backend", "Tutorial", "W3Schools"],
      },
    ];

    console.log("Creating courses...");
    const createdCourses = {};
    for (const course of courses) {
      const category = createdCategories[course.categoryName];
      const skill = createdSkills[course.skillName];

      if (!category || !skill) {
        console.log(
          `Skipping course ${course.title} due to missing category or skill`
        );
        continue;
      }

      const result = await prisma.course.upsert({
        where: { code: course.code },
        update: {},
        create: {
          title: course.title,
          code: course.code,
          description: course.description,
          content: course.content,
          categoryId: category.id,
          skillId: skill.id,
        },
      });
      createdCourses[course.code] = result;
      console.log(`- Created course: ${course.title}`);
    }

    // Roadmaps
    const roadmaps = [
      {
        title: "Frontend Web Developer Path",
        description:
          "Complete learning path to become a frontend web developer",
        categoryName: "HTML and CSS",
        courseCodes: ["W3-HTML-101", "W3-CSS-101", "W3-JS-101"],
        tagNames: ["Beginner", "Web Development", "Frontend", "W3Schools"],
      },
      {
        title: "Backend Developer Path",
        description: "Complete learning path to become a backend developer",
        categoryName: "Backend",
        courseCodes: ["W3-PY-101", "W3-SQL-101"],
        tagNames: ["Beginner", "Backend", "Database", "W3Schools"],
      },
    ];

    console.log("Creating roadmaps...");
    for (const roadmap of roadmaps) {
      const category = createdCategories[roadmap.categoryName];

      if (!category) {
        console.log(
          `Skipping roadmap ${roadmap.title} due to missing category`
        );
        continue;
      }

      // Check if roadmap exists
      let existingRoadmap = await prisma.roadmap.findFirst({
        where: {
          title: roadmap.title,
          userId: adminUser.id,
        },
      });

      let createdRoadmap;
      if (existingRoadmap) {
        console.log(`Roadmap ${roadmap.title} already exists, updating...`);
        createdRoadmap = await prisma.roadmap.update({
          where: { id: existingRoadmap.id },
          data: {
            description: roadmap.description,
            categoryId: category.id,
          },
        });
      } else {
        // Create nodes data based on courses
        const nodesData = [];
        const edgesData = [];
        let posX = 100;
        let lastNodeId = null;

        for (const courseCode of roadmap.courseCodes) {
          const course = createdCourses[courseCode];
          if (!course) continue;

          const nodeId = `node-${course.id}`;
          nodesData.push({
            id: nodeId,
            position: { x: posX, y: 100 },
            data: { label: course.title },
          });

          if (lastNodeId) {
            edgesData.push({
              id: `edge-${lastNodeId}-${nodeId}`,
              source: lastNodeId,
              target: nodeId,
            });
          }

          lastNodeId = nodeId;
          posX += 200;
        }

        createdRoadmap = await prisma.roadmap.create({
          data: {
            title: roadmap.title,
            description: roadmap.description,
            categoryId: category.id,
            userId: adminUser.id,
            nodesData: JSON.stringify(nodesData),
            edgesData: JSON.stringify(edgesData),
          },
        });
      }

      console.log(`- Created roadmap: ${roadmap.title}`);

      // Create nodes for the roadmap
      let posX = 100;
      let lastNodeId = null;

      for (const courseCode of roadmap.courseCodes) {
        const course = createdCourses[courseCode];
        if (!course) continue;

        const nodeIdentifier = `node-${createdRoadmap.id}-${course.id}`;

        // Check if node exists
        const existingNode = await prisma.node.findFirst({
          where: {
            roadmapId: createdRoadmap.id,
            courseId: course.id,
          },
        });

        if (!existingNode) {
          const node = await prisma.node.create({
            data: {
              nodeIdentifier,
              positionX: posX,
              positionY: 100,
              data: JSON.stringify({
                label: course.title,
                description: course.description,
                type: "course",
              }),
              roadmapId: createdRoadmap.id,
              courseId: course.id,
            },
          });

          console.log(`  - Created node: ${node.nodeIdentifier}`);

          if (lastNodeId) {
            const edge = await prisma.edge.create({
              data: {
                edgeIdentifier: `edge-${createdRoadmap.id}-${lastNodeId}-${nodeIdentifier}`,
                source: lastNodeId,
                target: nodeIdentifier,
                type: "straight",
                animated: true,
                roadmapId: createdRoadmap.id,
              },
            });
            console.log(`  - Created edge: ${edge.edgeIdentifier}`);
          }

          lastNodeId = nodeIdentifier;
          posX += 200;
        }
      }

      // Link roadmap with tags
      for (const tagName of roadmap.tagNames) {
        const tag = createdTags[tagName];
        if (!tag) continue;

        // Check if link exists
        const existingLink = await prisma.roadmapTag
          .findUnique({
            where: {
              roadmapId_tagId: {
                roadmapId: createdRoadmap.id,
                tagId: tag.id,
              },
            },
          })
          .catch(() => null);

        if (!existingLink) {
          await prisma.roadmapTag.create({
            data: {
              roadmapId: createdRoadmap.id,
              tagId: tag.id,
            },
          });
          console.log(`  - Linked tag: ${tagName}`);
        }
      }
    }

    console.log("✅ W3Schools-like educational content imported successfully!");
  } catch (error) {
    console.error("❌ Error importing data:", error);
    if (error.meta) {
      console.error("Meta information:", error.meta);
    }
  } finally {
    await prisma.$disconnect();
    console.log("Database connection closed.");
  }
}

// Execute the script
console.log("Starting W3Schools educational content import...");
main()
  .then(() => console.log("Import process completed."))
  .catch((e) => {
    console.error("Import process failed:", e);
    process.exit(1);
  });
