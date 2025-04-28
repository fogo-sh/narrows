import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import grack from "../assets/grack.png";
import { PostView, testPosts } from "../components/post";
import { Form, redirect, useLoaderData } from "react-router";
import prisma from "../lib/prisma";
import { getSession } from "../sessions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CSBForum" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    // Redirect to the home page if they are already signed in.
    return await prisma.post.findMany({
      select: {
        content: true,
        createdAt: true,
        user: true,
      }
    });
  }

  return redirect("/login");
}
export async function action({ request }: Route.ActionArgs) {
  console.log("HELLO");
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const formData = await request.formData();
  const content = formData.get("content");
  try {
    await prisma.post.create({
      data: {
        userid: userId,
        content: content,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export default function Home() {
  const posts = useLoaderData<typeof loader>();
  console.log(posts);
  return (
    <main className="flex items-center justify-center pt-16 pb-4 px-64">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-row border-b-2 items-end pb-1 gap-5 w-full">
          <div className="flex flex-row items-end">
            <img src={grack} />
            <h1 className="text-2xl">CSBForum</h1>
          </div>
          <a>Posts</a>

          <a href="/login">login</a>
          <a href="/register">register</a>
        </div>

        <div className="flex flex-col gap-4 px-8">
          <Form action="" method="post">
            <h1>Make Post:</h1>
            <input name="content" type="text" />
            <input name="submit" type="submit" />
          </Form>
          {posts.map((post, index) => (
            <PostView key={index} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
