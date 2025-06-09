# W3Schools-like Educational Content for IT Roadmap Application

This directory contains SQL files to populate your database with educational content similar to W3Schools. The data includes skills, categories, tags, courses, and roadmaps structured in a way that follows the W3Schools learning approach.

## Files Included

1. **w3schools_data_seed.sql** - Basic data for skills, categories, and tags
2. **w3schools_courses_seed.sql** - Educational course content with detailed markdown descriptions
3. **w3schools_roadmaps_seed.sql** - Learning path roadmaps with nodes and connections

## How to Import the Data

### Using psql (PostgreSQL command-line client):

```bash
# Connect to your database
psql -U <username> -d <database_name>

# Run the SQL files in order
\i w3schools_data_seed.sql
\i w3schools_courses_seed.sql
\i w3schools_roadmaps_seed.sql
```

### Using the Prisma ORM:

```javascript
// Create a script in your server directory (e.g., seed-w3schools-data.js)
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

async function main() {
  try {
    // Read SQL files
    const dataPath = path.join(__dirname, "db", "w3schools_data_seed.sql");
    const coursesPath = path.join(
      __dirname,
      "db",
      "w3schools_courses_seed.sql"
    );
    const roadmapsPath = path.join(
      __dirname,
      "db",
      "w3schools_roadmaps_seed.sql"
    );

    const dataSql = fs.readFileSync(dataPath, "utf8");
    const coursesSql = fs.readFileSync(coursesPath, "utf8");
    const roadmapsSql = fs.readFileSync(roadmapsPath, "utf8");

    // Execute SQL using Prisma's executeRaw
    console.log("Importing basic data...");
    await prisma.$executeRawUnsafe(dataSql);

    console.log("Importing courses...");
    await prisma.$executeRawUnsafe(coursesSql);

    console.log("Importing roadmaps...");
    await prisma.$executeRawUnsafe(roadmapsSql);

    console.log("Data import completed successfully");
  } catch (error) {
    console.error("Error importing data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

Run the script with:

```bash
node seed-w3schools-data.js
```

## Data Organization

### Categories

The W3Schools-inspired categories include:

- HTML and CSS
- JavaScript
- Backend
- Data Analytics
- Web Building

### Skills

Over 40 skills are organized by category, covering:

- Web markup and styling (HTML, CSS, etc.)
- Frontend technologies (JavaScript, React, etc.)
- Backend languages (Python, PHP, Java, etc.)
- Database systems (SQL, MongoDB, etc.)
- Data science and analysis tools

### Tags

Tags are divided into three categories:

1. General tags (Beginner, Intermediate, Advanced, etc.)
2. Domain-specific tags (Web Development, Frontend, Backend, etc.)
3. Technology-specific tags (HTML5, CSS3, Python3, etc.)

### Courses

Educational courses with detailed content, formatted in Markdown for easy rendering in your application.

### Roadmaps

Learning paths that connect related courses in a logical progression, similar to how W3Schools organizes its learning materials.

## Notes for Development

- The user_id in roadmaps is set to 1, assuming an admin user with ID 1 exists in your database
- Course IDs in the nodes table might need adjustment based on your actual database state
- The node and edge data structures follow React Flow requirements for visualization

## Customization

You may need to adjust:

1. IDs referenced in foreign key relationships
2. Course content to match your application's specific needs
3. Node positions and connections in roadmaps to create better visual representations

## Color Scheme

The W3Schools-inspired color scheme uses:

- Main green: #04AA6D (for primary elements)
- Secondary green: #4CAF50 (for accents)
- Black: #282A35 (for text and backgrounds)
- White: #FFFFFF (for contrast elements)
- Light gray: #F1F1F1 (for backgrounds)
