import { useEffect } from 'react';
import { LoaderFunctionArgs } from 'react-router';
import UserCard from '~/components/user-card';
import { authClient } from '~/lib/auth-client';
import { auth, protectedRoute } from '~/lib/auth-server';
export const loader = async ({ request }: LoaderFunctionArgs) => {
    await protectedRoute(new Headers(request.headers))
    const session = await auth.api.getSession({ headers: request.headers })
    return { session }
}
export default function profile() {
    const { data } = authClient.useListPasskeys();
    console.log(data)
    return (
        <div className='max-w-6xl my-5 mx-auto'>
            <UserCard/>
        </div>
    )
}
