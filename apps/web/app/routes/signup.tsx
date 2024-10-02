import { ActionFunctionArgs } from "@remix-run/node"
import { Form, Link, useActionData } from "@remix-run/react"
import { z } from 'zod'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { authClient } from "~/lib/auth.client"
export async function action({ request }: ActionFunctionArgs) {
    const formPayload = Object.fromEntries(await request.formData())
    const signUpSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
    })
    const formData = await signUpSchema.safeParseAsync(formPayload)
    if (!formData.success) {
        return formData
    }
    await authClient.signUp.email(formData.data)
}
export default function SignUpPage() {
    const actionData = useActionData<typeof action>()
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] max-h-screen">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <Form className="grid gap-4" method="post">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                name="email"
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    to="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input
                                name="password"
                                id="password"
                                type="password"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="#" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80"
                    className="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
