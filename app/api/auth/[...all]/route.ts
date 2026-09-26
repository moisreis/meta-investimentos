import { auth } from "@/clients/better-auth.client"
import type { NextRequest } from "next/server"

/**
 * @summary
 * Handles `GET` requests for the **Better-Auth** API.
 *
 * @remarks
 * Delegates every request to the shared `auth` instance so
 * the framework can answer sign-in, sign-up and session
 * queries through the `[...all]` catch-all route.
 *
 * @explanation
 * Export this handler from the route file to expose the
 * **Better-Auth** endpoints at `/api/auth/*`. Keep the route
 * as a thin wrapper around the configured client instance.
 *
 * @param request - The incoming server request.
 * @returns The **Better-Auth** response.
 *
 * @example
 * <Routes GET handler for `/api/auth/*`>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export async function GET(
  request: NextRequest
): Promise<Response> {
  return auth.handler(request)
}

/**
 * @summary
 * Handles `POST` requests for the **Better-Auth** API.
 *
 * @remarks
 * Delegates every request to the shared `auth` instance so
 * the framework can answer credential and registration
 * submissions through the `[...all]` catch-all route.
 *
 * @explanation
 * Export this handler from the route file to expose the
 * **Better-Auth** endpoints at `/api/auth/*`. Keep the route
 * as a thin wrapper around the configured client instance.
 *
 * @param request - The incoming server request.
 * @returns The **Better-Auth** response.
 *
 * @example
 * <Routes POST handler for `/api/auth/*`>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export async function POST(
  request: NextRequest
): Promise<Response> {
  return auth.handler(request)
}
