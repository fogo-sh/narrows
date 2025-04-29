import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.DATABASE_URL ?? "file:./narrows.db";

export default defineConfig({
  out: "./drizzle",
  schema: "./database/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbUrl,
  },
});
