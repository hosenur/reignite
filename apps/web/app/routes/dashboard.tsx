import { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Omg from '~/components/omg'
import UserCard from '~/components/user-card'
import { auth, protectedRoute } from '~/lib/auth.server'
export const loader = async ({ request }: LoaderFunctionArgs) => {
    await protectedRoute(new Headers(request.headers))
    const session = await auth.api.getSession({ headers: new Headers(request.headers) })
    const activeSessions = await auth.api.listSessions({ headers: new Headers(request.headers) })
    return { session, activeSessions }
}
export default function Dashboard() {
    const { session, activeSessions } = useLoaderData<typeof loader>()
    return (
        <div className="max-w-6xl py-5 mx-auto">
            <div className="flex gap-4 flex-col">
                <UserCard
                    session={session}
                    activeSessions={activeSessions}
                />
            </div>
        </div>
    )
}
