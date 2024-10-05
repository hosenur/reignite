import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { passkey, twoFactor } from "better-auth/plugins"
import { redirect } from "react-router";





export const auth = betterAuth({
    plugins: [
        passkey(),
        twoFactor()
    ],
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
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
        throw redirect('/profile')
    }
}