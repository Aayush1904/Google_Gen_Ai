const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

// Database connection
const sql = neon(
  process.env.NEXT_PUBLIC_DB_CONNECTION_STRING ||
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:rb7JgAGiy4SC@ep-snowy-block-a5zonir7.us-east-2.aws.neon.tech/neondb?sslmode=require"
);

async function updateDatabase() {
  try {
    console.log("🔄 Starting database update...");

    // Read the SQL file
    const sqlFile = path.join(__dirname, "add-missing-columns.sql");
    const sqlContent = fs.readFileSync(sqlFile, "utf8");

    // Split SQL commands by semicolon and filter out empty ones
    const commands = sqlContent
      .split(";")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.length > 0 && !cmd.startsWith("--"));

    console.log(`📝 Executing ${commands.length} SQL commands...`);

    // Execute each command separately
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`  ${i + 1}/${commands.length}: Executing command...`);
          await sql(command);
        } catch (error) {
          // Some commands might fail if columns/tables already exist, which is fine
          if (
            error.message.includes("already exists") ||
            error.message.includes("does not exist")
          ) {
            console.log(
              `  ⚠️  Command ${i + 1} skipped (already exists or not needed)`
            );
          } else {
            console.error(`  ❌ Command ${i + 1} failed:`, error.message);
            throw error;
          }
        }
      }
    }

    console.log("✅ Database update completed successfully!");
    console.log("🎉 All missing columns and tables have been added.");
  } catch (error) {
    console.error("❌ Error updating database:", error);
    process.exit(1);
  }
}

// Run the update
updateDatabase();
