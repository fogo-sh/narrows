import { RequestInfo } from "@redwoodjs/sdk/worker";

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <p>{ctx.user ? "You are logged in!" : "You are not logged in"}</p>
    </div>
  );
}
