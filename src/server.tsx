import { Hono } from "hono";
import { type HttpBindings, serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { renderRequest, callAction } from "@parcel/rsc/node";

import { Page } from "./Page";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use("/*", serveStatic({ root: "./dist" }));

app.get("/", async (c) => {
  await renderRequest(c.env.incoming, c.env.outgoing, <Page />, {
    component: Page,
  });
  return c.body(null);
});

app.post("/", async (c) => {
  const id = c.req.header("rsc-action-id");
  const { result } = await callAction(c.env.incoming, id);
  let root: any = <Page />;
  if (id) {
    root = { result, root };
  }
  await renderRequest(c.env.incoming, c.env.outgoing, root, {
    component: Page,
  });
  return c.body(null);
});

serve({ fetch: app.fetch, port: 3000 });
