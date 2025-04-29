import { createRequestHandler } from "@react-router/express";
import { drizzle } from "drizzle-orm/libsql";
import express from "express";
import { createClient } from "@libsql/client";
import "react-router";

import { DatabaseContext } from "~/database/context";
import * as schema from "~/database/schema";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export const app = express();

const dbUrl = process.env.DATABASE_URL ?? "file:./narrows.db";

const client = createClient({ url: dbUrl });
const db = drizzle(client, { schema });
app.use((_, __, next) => DatabaseContext.run(db, next));

app.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: "Hello from Express",
      };
    },
  })
);
