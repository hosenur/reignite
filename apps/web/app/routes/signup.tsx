import { LoaderFunctionArgs } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { authClient } from "~/lib/auth.client"
import { guestRoute } from "~/lib/auth.server"
import { z } from "zod"
export async function loader({ request }: LoaderFunctionArgs) {
    const headers = new Headers(request.headers)
    await guestRoute(headers)
    return null;
}
export default function SignUpPage() {
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
    })

    const handleSubmit = async () => {
        const signUpSchema = z.object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(8)
        })
        const parsedData = await signUpSchema.safeParseAsync(credentials)
        console.log(credentials)
        if (!parsedData.success) {
            return toast.error(parsedData.error.errors[0].message)
            // return toast.error(parsedData.error)
        }
        await authClient.signUp.email(credentials, {
            onSuccess(ctx) {
                toast.success("Successfully registered")
            },
            onError(ctx) {
                toast.error(ctx.error.message)
            }
        })

    }
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
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                name="name"
                                value={credentials.name}
                                onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                                id="name"
                                type="text"
                                placeholder="Hosenur Rahaman"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                name="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                id="email"
                                type="email"
                                placeholder="hosenur.dev@gmail.com"
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
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                id="password"
                                type="password"
                                required
                            />
                        </div>
                        <Button
                            onClick={handleSubmit}
                            type="submit" className="w-full">
                            Login
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="#" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
            </div>
        </div>
    )
}

