import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: integer().primaryKey(),
  name: text().notNull(),
  discordId: text().notNull().unique(),
});

export const postTable = sqliteTable("post", {
  id: integer().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  authorId: integer()
    .notNull()
    .references(() => userTable.id),
  createdAt: integer()
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer()
    .notNull()
    .default(sql`(unixepoch())`),
});
