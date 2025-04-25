import type {
  RESTGetAPIUserResult,
  RESTPostOAuth2AccessTokenResult,
} from "discord-api-types/v10";
import { db, type User } from "./db";
import { log } from "./logs";

const DISCORD_CLIENT_ID = process.env.NARROWS_DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.NARROWS_DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.NARROWS_DISCORD_REDIRECT_URI;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI) {
  throw new Error("Missing required authentication environment variables");
}

export async function requireAuth(req: Bun.BunRequest) {
  const session = req.cookies.get("session");

  if (!session) {
    log.debug("no session cookie, redirecting to login");
    return {
      success: false,
      response: Response.redirect(`${new URL(req.url).origin}/auth/login`),
    };
  }

  try {
    const [user] = db
      .query("SELECT * FROM user WHERE session = $session")
      .all({ $session: session }) as User[];

    if (!user) {
      log.debug("no user found, redirecting to login");
      const response = Response.redirect(
        `${new URL(req.url).origin}/auth/login`
      );
      req.cookies.delete("session");
      return { success: false, response };
    }

    log.debug("user found, returning user");

    return { success: true, user };
  } catch (error) {
    log.error("auth error:", error);
    return {
      success: false,
      response: Response.redirect(`${new URL(req.url).origin}/auth/login`),
    };
  }
}

export async function authLoginRoute() {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID!,
    redirect_uri: DISCORD_REDIRECT_URI!,
    response_type: "code",
    scope: "identify",
  });

  log.debug("redirecting to discord oauth2");

  return Response.redirect(
    `https://discord.com/api/oauth2/authorize?${params}`
  );
}

export async function authCallbackRoute(req: Bun.BunRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    log.warn("user error - missing auth code");
    return new Response("missing auth code", { status: 400 });
  }

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID!,
        client_secret: DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI!,
      }),
    });

    const tokenData =
      (await tokenResponse.json()) as RESTPostOAuth2AccessTokenResult;

    if (!tokenData.access_token) {
      log.warn("user error - failed to get access token");
      return new Response("failed to get access token", { status: 400 });
    }

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const discordUser = (await userResponse.json()) as RESTGetAPIUserResult;

    let user = db
      .query("SELECT * FROM user WHERE discord_id = $id")
      .get({ $id: discordUser.id }) as User | null;

    const sessionId = crypto.randomUUID();

    if (!user) {
      const displayName = discordUser.username || discordUser.global_name;
      if (!displayName) {
        log.warn("user error - failed to get display name");
        return new Response("failed to get display name", { status: 400 });
      }
      log.info("creating new user with username:", displayName);

      user = db
        .query(
          "INSERT INTO user (discord_id, username, session) VALUES ($id, $username, $session) RETURNING *"
        )
        .get({
          $id: discordUser.id,
          $username: displayName,
          $session: sessionId,
        }) as User;
    } else {
      log.debug("updating user session:", sessionId);
      db.query("UPDATE user SET session = $session WHERE discord_id = $id").run(
        { $session: sessionId, $id: discordUser.id }
      );
      user.session = sessionId;
    }

    if (!user) {
      throw new Error("failed to create or update user");
    }

    if (!user.session) {
      throw new Error("user has no session");
    }

    const response = Response.redirect("/");

    req.cookies.set("session", user.session, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7 * 4, // 4 weeks
      sameSite: "lax",
    });

    log.debug("set session, returning to /");

    return response;
  } catch (error) {
    log.error("auth callback error:", error);
    return new Response("authentication failed", { status: 500 });
  }
}

export async function authLogoutRoute(req: Bun.BunRequest) {
  log.debug("deleting session cookie");
  req.cookies.delete("session");
  const response = Response.redirect("/");
  return response;
}
