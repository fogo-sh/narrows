import type { PrismaClient } from "@prisma/client";
import danitest from "./danitest.png";
import type { Post } from "../generated/prisma";

export const PostView = ({ post }: { post: Post }) => (
  <div className="items-end">
    <h2>{post.createdAt.toISOString()}</h2>
    <div className="flex flex-row w-full gap-8  p-4 bg-gray-100">
      <div className="flex flex-col gap-1  items-center">
        <img src={danitest} className="max-w-16 rounded-2xl border-2" />
        <h1>{post.user.username}</h1>
      </div>
      <p className="">{post.content}</p>
    </div>
  </div>
);

export const testPosts = [
  {
    createdAt: new Date(),
    id: "dani",
    content:
      "it's unfortunately another one of those things where ill just override it and undo the time limit, ive tried that before. Part of me thinks my next phone should just be a dumb phone for my own good",
  },
  {
    createdAt: new Date(),
    id: "natalie",
    content: "yeehaw penis penis penis",
  },
];
