import { Form, redirect, useActionData } from "react-router";
import type { Route } from "../+types/root";
import prisma from "../lib/prisma";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  try {
    await prisma.user.create({
      data: {
        username,
        password,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to register" }, { status: 500 });
  }
  return redirect("/");
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
