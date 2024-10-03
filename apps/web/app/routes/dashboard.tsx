import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import React from 'react'
import { auth, protectedRoute } from '~/lib/auth.server'
export const loader = async ({ request }: LoaderFunctionArgs) => {
    await protectedRoute(new Headers(request.headers))
    return null;

}
export default function Dashboard() {
    return (
        <div>Dashboard</div>
    )
}
