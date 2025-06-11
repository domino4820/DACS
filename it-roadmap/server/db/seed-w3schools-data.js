const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

/**
 * Import W3Schools-like educational content into the database
 * This script reads the SQL files and executes them using Prisma's raw query execution
 */
async function main() {
  try {
    // Read SQL files
    const dataPath = path.join(__dirname, "w3schools_data_seed.sql");
    const coursesPath = path.join(__dirname, "w3schools_courses_seed.sql");
    const roadmapsPath = path.join(__dirname, "w3schools_roadmaps_seed.sql");

    console.log("Reading SQL files...");
    const dataSql = fs.readFileSync(dataPath, "utf8");
    const coursesSql = fs.readFileSync(coursesPath, "utf8");
    const roadmapsSql = fs.readFileSync(roadmapsPath, "utf8");

    // Execute SQL statements individually
    console.log("Importing basic data (skills, categories, tags)...");
    const dataStatements = splitSqlStatements(dataSql);
    console.log(`Found ${dataStatements.length} data statements to execute`);

    for (let i = 0; i < dataStatements.length; i++) {
      const statement = dataStatements[i].trim();
      if (statement) {
        try {
          await prisma.$executeRawUnsafe(statement);
          if (i > 0 && i % 10 === 0) {
            console.log(
              `Executed ${i}/${dataStatements.length} data statements`
            );
          }
        } catch (error) {
          console.error(
            `Error executing statement: ${statement.substring(0, 50)}...`
          );
          console.error(error);
        }
      }
    }

    console.log("Importing courses and educational content...");
    const courseStatements = splitSqlStatements(coursesSql);
    console.log(
      `Found ${courseStatements.length} course statements to execute`
    );

    for (let i = 0; i < courseStatements.length; i++) {
      const statement = courseStatements[i].trim();
      if (statement) {
        try {
          await prisma.$executeRawUnsafe(statement);
          if (i > 0 && i % 5 === 0) {
            console.log(
              `Executed ${i}/${courseStatements.length} course statements`
            );
          }
        } catch (error) {
          console.error(
            `Error executing statement: ${statement.substring(0, 50)}...`
          );
          console.error(error);
        }
      }
    }

    console.log("Importing roadmaps, nodes and connections...");
    const roadmapStatements = splitSqlStatements(roadmapsSql);
    console.log(
      `Found ${roadmapStatements.length} roadmap statements to execute`
    );

    for (let i = 0; i < roadmapStatements.length; i++) {
      const statement = roadmapStatements[i].trim();
      if (statement) {
        try {
          await prisma.$executeRawUnsafe(statement);
          if (i > 0 && i % 5 === 0) {
            console.log(
              `Executed ${i}/${roadmapStatements.length} roadmap statements`
            );
          }
        } catch (error) {
          console.error(
            `Error executing statement: ${statement.substring(0, 50)}...`
          );
          console.error(error);
        }
      }
    }

    console.log("✅ W3Schools-like educational content imported successfully!");
    console.log(
      "The IT Roadmap application now has educational content similar to W3Schools."
    );
  } catch (error) {
    console.error("❌ Error importing W3Schools-like data:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Database connection closed.");
  }
}

/**
 * Split SQL file content into individual statements
 * @param {string} sqlContent - The SQL file content
 * @returns {string[]} - Array of SQL statements
 */
function splitSqlStatements(sqlContent) {
  // Remove comments
  const noComments = sqlContent.replace(/--.*$/gm, "");

  // Split by semicolons, but not those inside quotes
  let inQuote = false;
  let currentStatement = "";
  const statements = [];

  for (let i = 0; i < noComments.length; i++) {
    const char = noComments[i];

    // Handle quotes
    if (char === "'" && noComments[i - 1] !== "\\") {
      inQuote = !inQuote;
    }

    // If semicolon outside of quotes, split the statement
    if (char === ";" && !inQuote) {
      statements.push(currentStatement + ";");
      currentStatement = "";
    } else {
      currentStatement += char;
    }
  }

  // Add the last statement if there's any
  if (currentStatement.trim()) {
    statements.push(currentStatement);
  }

  return statements.filter((stmt) => stmt.trim().length > 0);
}

// Execute the script
console.log("Starting W3Schools educational content import...");
main()
  .then(() => console.log("Import process completed."))
  .catch((e) => {
    console.error("Import process failed:", e);
    process.exit(1);
  });
