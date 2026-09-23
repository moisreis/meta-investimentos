"use client"

import { createAuthClient } from "better-auth/react"

// Auth client for the browser, configured with the Better Auth URL.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
})