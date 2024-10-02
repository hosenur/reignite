import { authServer } from '~/lib/auth.server' // Adjust the path as necessary
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node"

export async function loader({ request }: LoaderFunctionArgs) {
    return authServer.handler(request)
}

export async function action({ request }: ActionFunctionArgs) {
    return authServer.handler(request)
}