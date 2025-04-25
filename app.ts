import { serve } from "bun";
import { db, type User } from "./db";

import indexHtml from "./pages/index.html";
import {
  authCallbackRoute,
  authLoginRoute,
  authLogoutRoute,
  requireAuth,
} from "./auth";
import { log } from "./logs";

const development = process.env.NODE_ENV === "development";

if (development) {
  log.debug("running in development mode");
} else {
  log.debug("running in production mode");
}

const server = serve({
  websocket: {
    message(ws, message) {},
  },
  routes: {
    "/": indexHtml,

    "/auth/login": () => authLoginRoute(),

    "/auth/callback": (req) => authCallbackRoute(req),

    "/auth/logout": (req) => authLogoutRoute(req),

    "/api/users": {
      async GET(req) {
        const auth = await requireAuth(req);
        if (!auth.success) return auth.response;

        const users = (await db
          .query("SELECT id, username, discord_id, created_at FROM user")
          .all()) as User[];

        return Response.json(users);
      },
    },

    "/api/users/:id": async (req) => {
      const auth = await requireAuth(req);
      if (!auth.success) return auth.response;

      const { id } = req.params;
      const user = (await db
        .query(
          "SELECT id, username, discord_id, created_at FROM user WHERE id = $id"
        )
        .get({ $id: id })) as User | null;

      return Response.json({
        id: user?.id,
        username: user?.username,
        discordId: user?.discord_id,
        createdAt: user?.created_at,
      });
    },

    "/api/me": async (req) => {
      const auth = await requireAuth(req);
      if (!auth.success) return auth.response;

      return Response.json(auth.user);
    },
  },

  development,
});

log.info(`narrows listening on ${server.url}`);
