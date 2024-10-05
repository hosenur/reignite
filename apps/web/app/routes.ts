import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export const routes: RouteConfig = [
    index("routes/home.tsx"),
    route("signin", "routes/sign-in.tsx"),
    route("signup", "routes/sign-up.tsx"),
    route("profile", "routes/profile.tsx"),
    route("api/auth/*", "routes/api.auth.$.ts"),
];
