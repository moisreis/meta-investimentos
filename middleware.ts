import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Apply optimistic session verification to authenticated routes.
 *
 * Only the signed-in session cookie is checked here; the accompanying
 * `auth` client exposes the full session (user id, expiry) that use cases
 * need for an authenticated actor (e.g. `reversedByUserId` in audit).
 *
 * The check is optimistic: it only verifies the cookie exists, not that the
 * session is still valid. Every API handler and page must re-validate the
 * session server-side for anything sensitive.
 *
 * The Better Auth routes themselves (`/api/auth/*`) are excluded because
 * they manage the sign-in / session lifecycle internally.
 */
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (sessionCookie) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}

export const config = {
  matcher: [
    "/api/((?!auth).*)",
    "/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
