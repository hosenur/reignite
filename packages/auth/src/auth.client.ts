import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react

export const client = createAuthClient({
    baseURL: "http://localhost:5173"
})