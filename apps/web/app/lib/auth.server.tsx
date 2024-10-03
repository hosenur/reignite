import { redirect } from "@remix-run/node";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { VerifyEmail } from "../../emails/verify-email";
import { prisma } from "./prisma";
import { resend } from "./resend";
import { passkey } from "better-auth/plugins"




export const auth = betterAuth({
    plugins: [
        passkey()
    ],
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
        async sendVerificationEmail(email, url) {

            await resend.emails.send({
                from: 'reignite@hosenur.email',
                to: email,
                subject: 'Verify your email',
                react: <VerifyEmail magicLink={url} />
            }).catch((err) => {
                console.log(err)
            }).then((res) => {
                console.log(res)
            })


        }
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