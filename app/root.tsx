import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { logout } from "./auth.server";

export const links: Route.LinksFunction = () => [];

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "logout") {
    return await logout(request);
  }

  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <h1>narrows</h1>
        </header>
        <nav>
          <Link to="/">
            <button type="submit">home</button>
          </Link>
          <Link to="/account">
            <button type="submit">account</button>
          </Link>
          <form method="post" action="/">
            <input type="hidden" name="action" value="logout" />
            <button type="submit">logout</button>
          </form>
        </nav>
        <main>{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "uh oh";
  let details = "an unexpected error occurred";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "error";
    details =
      error.status === 404
        ? "the requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="error-boundary">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </div>
  );
}
