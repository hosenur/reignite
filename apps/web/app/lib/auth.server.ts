import { betterAuth, Auth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { redirect } from "@remix-run/node";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true
    }
})

export const protectedRoute = async (headers: Headers) => {
    const session = await auth.api.getSession({ headers: headers })
    if (!session) {
        throw redirect('/signin')
    }
}
export const guestRoute = async (headers: Headers) => {
    const session = await auth.api.getSession({ headers: headers })
    if (session) {
        throw redirect('/dashboard')
    }
}