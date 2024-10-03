import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import {
    organizationClient,
    passkeyClient,
    twoFactorClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:5173",
    plugins: [
        passkeyClient(),
    ]
})

export const {
    signUp,
    signIn,
    signOut,
    useSession,
    user,
} = authClient;
