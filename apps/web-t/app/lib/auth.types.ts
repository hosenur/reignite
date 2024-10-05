import type { auth } from "./auth.server";
import { authClient } from "./auth.client";

export type Session = typeof auth.$Infer.Session;
