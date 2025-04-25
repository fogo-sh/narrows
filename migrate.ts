import { db } from "./db";
import { log } from "./logs";

try {
  const migrationSQL = await Bun.file("migrations/01_init.sql").text();
  const [up, down] = migrationSQL.split("-- down\n").map((s) => s.trim());

  if (!up || !down) {
    throw new Error("Invalid migration file");
  }

  log.info("running up migration...\n", up, "\n");
  db.exec(up);

  log.info("migrations completed successfully!");

  db.close();
} catch (error) {
  log.error("migration failed:", error);
  process.exit(1);
}
