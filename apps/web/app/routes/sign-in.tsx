import { ActionFunctionArgs, Form, Link } from 'react-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export async function clientAction({ request }: ActionFunctionArgs) {
    console.log(Object.fromEntries(await request.formData()))

}
export default function SignInPage() {
    return (
        <div className="w-full max-w-full overflow-x-hidden lg:grid lg:min-h-[600px] lg:grid-cols-5  max-h-screen">
            <div className="flex items-center justify-center py-12 lg:col-span-2">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 ">
                        <h1 className={"text-4xl font-semibold "}>Sign In</h1>
                        <p className="text-muted-foreground">
                            Enter your email and password to continue.
                        </p>
                    </div>
                    <Form method='POST' className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                name="email"
                                id="email"
                                type="email"
                                placeholder="hosenur@duotone.ink"
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
                                placeholder="Super Strong Password"
                                id="password"
                                type="password" required />
                        </div>
                        <Button
                            type="submit" className="w-full">
                            Login
                        </Button>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="underline">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block h-screen lg:col-span-3 w-full">

            </div>
        </div>
    )
}