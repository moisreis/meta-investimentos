import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Apply server-side session verification to authenticated routes.
 *
 * Only the signed-in session cookie is checked here; the accompanying
 * `auth` client exposes the full session (user id, expiry) that use cases
 * need for an authenticated actor (e.g. `reversedByUserId` in audit).
 *
 * The Better Auth routes themselves (`/api/auth/*`) are excluded because
 * they manage the sign-in / session lifecycle internally.
 */
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/((?!auth).*)"],
};
