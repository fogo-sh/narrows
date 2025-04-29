import type { Route } from "./+types/login";
import { Form } from "react-router";
import { redirectToDiscordOauth2Flow } from "~/auth.server";

export async function action() {
  return redirectToDiscordOauth2Flow();
}

export default function Login({}: Route.ComponentProps) {
  return (
    <div>
      <Form method="post">
        <button type="submit">login with discord</button>
      </Form>
    </div>
  );
}
