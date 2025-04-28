import { Form, redirect, useActionData } from "react-router";
import type { Route } from "../+types/root";
import prisma from "../lib/prisma";
import { commitSession, getSession } from "../sessions";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  try {

    const user = await prisma.user.findFirst({
      where: {
        username,
        password,
      },
    });
    console.log(user);


    if (!user) {
      session.flash("error", "Invalid username/password");
      return redirect("/login", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    session.set("userId", user.id);
    return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to login" }, { status: 500 });
  }
}

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <Form action="" method="post" navigate={false}>
      <label htmlFor="username">Username:</label>
      <input name="username" type="text" />
      <label htmlFor="password">Password:</label>
      <input name="password" type="text" />
      <input name="submit" type="submit"></input>
    </Form>
  );
}
