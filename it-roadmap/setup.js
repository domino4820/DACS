const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("📦 Setting up IT Roadmap project...");

// Check if .env file exists in server directory, create if not
const envPath = path.join(__dirname, "server", ".env");
if (!fs.existsSync(envPath)) {
  console.log("Creating .env file in server directory...");
  const envContent = `# Server Configuration
PORT=5000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/it_roadmap?schema=public"

# JWT Configuration
JWT_SECRET=yoursecretkey
JWT_EXPIRES_IN=7d`;

  fs.writeFileSync(envPath, envContent);
  console.log(
    "✅ .env file created. Please update with your database credentials."
  );
}

// Install server dependencies
console.log("\n📦 Installing server dependencies...");
exec("cd server && npm install", (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error installing server dependencies: ${error.message}`);
    return;
  }
  console.log("✅ Server dependencies installed successfully.");

  // Install client dependencies
  console.log("\n📦 Installing client dependencies...");
  exec("cd client && npm install", (error, stdout, stderr) => {
    if (error) {
      console.error(
        `❌ Error installing client dependencies: ${error.message}`
      );
      return;
    }
    console.log("✅ Client dependencies installed successfully.");

    // Generate Prisma client
    console.log("\n📦 Generating Prisma client...");
    exec(
      "cd server && npx prisma generate --schema=./db/schema.prisma",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error generating Prisma client: ${error.message}`);
          return;
        }
        console.log("✅ Prisma client generated successfully.");

        console.log("\n🚀 Setup completed successfully!");
        console.log("\nTo start the application:");
        console.log(
          "1. Update the .env file in the server directory with your database credentials"
        );
        console.log(
          "2. Run migrations: cd server && npx prisma migrate dev --schema=./db/schema.prisma"
        );
        console.log("3. Start server: cd server && npm run dev");
        console.log("4. Start client: cd client && npm start");
      }
    );
  });
});
