import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("account", "routes/account.tsx"),
  route("auth/callback", "routes/auth-callback.ts"),
] satisfies RouteConfig;
