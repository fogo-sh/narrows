import { Form, redirect } from "react-router";
import type { Route } from "./+types/home";
import { requireUser } from "~/auth.server";
import { database } from "~/database/context";
import { postTable, userTable } from "~/database/schema";
import { eq } from "drizzle-orm";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);

  const db = database();
  const posts = await db
    .select({
      id: postTable.id,
      title: postTable.title,
      content: postTable.content,
      authorName: userTable.name,
    })
    .from(postTable)
    .innerJoin(userTable, eq(postTable.authorId, userTable.id))
    .all();

  return { user, posts };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  const db = database();

  await db.insert(postTable).values({
    title: title.toString(),
    content: content.toString(),
    authorId: user.id,
  });

  return redirect("/");
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Form method="post" className="post-area">
        <input type="text" name="title" placeholder="title" />
        <textarea name="content" placeholder="content" rows={3} />
        <button type="submit">post</button>
      </Form>
      <div className="posts">
        {loaderData.posts.map((post) => (
          <div key={post.id} className="post">
            <p className="post-header">
              <span className="post-title">{post.title}</span> -{" "}
              <span className="post-author">{post.authorName}</span>
            </p>
            <p>{post.content}</p>
          </div>
        ))}
        {loaderData.posts.length === 0 && <p>no posts yet...</p>}
      </div>
    </>
  );
}
