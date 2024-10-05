import { LoaderFunctionArgs } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { useState } from "react"
import { toast } from "sonner"
import { Novatrix } from "uvcanvas"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { authClient } from "~/lib/auth.client"
import { guestRoute } from "~/lib/auth.server"
export const loader = async ({ request }: LoaderFunctionArgs) => {
    await guestRoute(new Headers(request.headers))
    return null;
}
export default function SignInPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async () => {
    await authClient.signIn.email(credentials, {
      onSuccess(ctx) {
        toast.success("Successfully logged in")
      },
      onError(ctx) {
        toast.error(ctx.error.message)
      }
    })
    console.log(credentials)
  }
  
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
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
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
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                name="password"
                placeholder="Super Strong Password"
                id="password"
                type="password" required />
            </div>
            <Button
              onClick={handleSubmit}
              type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline">
              Register
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block h-screen lg:col-span-3 w-full">
        <Novatrix />
      </div>
    </div>
  )
}