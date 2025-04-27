import { route } from "@redwoodjs/sdk/router";
import { sessions } from "./session/store";

export const authRoutes = [
  route("/login", async function ({ request }) {
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

    return new Response(null, {});
  }),
  route("/callback", async function ({ request }) {
    // TODO

    return new Response(null, {});
  }),
  route("/logout", async function ({ request }) {
    const headers = new Headers();
    await sessions.remove(request, headers);
    headers.set("Location", "/");

    return new Response(null, {
      status: 302,
      headers,
    });
  }),
];
