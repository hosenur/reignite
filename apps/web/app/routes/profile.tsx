import { LoaderFunctionArgs, useLoaderData } from 'react-router';
import UserCard from '~/components/user-card';
import { auth, protectedRoute } from '~/lib/auth.server';
export const loader = async ({ request }: LoaderFunctionArgs) => {
    await protectedRoute(new Headers(request.headers))
    const session = await auth.api.getSession({ headers: request.headers })
    return { session }
}
export default function profile() {
    const { session } = useLoaderData();
    return (
        <div className='max-w-6xl my-5 mx-auto'>
            <UserCard session={session} />
        </div>
    )
}
