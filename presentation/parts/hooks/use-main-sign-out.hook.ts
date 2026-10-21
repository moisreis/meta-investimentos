"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import { AuthContainer } from "@/presentation/composition/auth.container"

// Route the browser lands on after a successful sign out.
const SIGN_IN_ROUTE = "/sign-in"

/**
 * View model of the account sign-out flow.
 */
export interface MainSignOutModel {
  signOut: () => Promise<void>
  pending: boolean
}

/**
 * @summary
 * Signs the acting user out of the account menu.
 *
 * @remarks
 * Clears the session through the auth container, so the
 * account menu never names the auth library on its own, then
 * navigates to the sign-in route and refreshes the server
 * data, so the cleared session is reflected everywhere. The
 * pending flag blocks a second attempt while the session is
 * being cleared.
 *
 * @explanation
 * Use on the account menu item that ends the session.
 *
 * @returns The sign-out handler and the pending flag.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
function useMainSignOut(): MainSignOutModel {
  const ROUTER = useRouter()
  const [PENDING, setPending] = useState(false)

  const SignOut = useCallback(async () => {
    setPending(true)

    try {
      const { signOut } = AuthContainer()
      await signOut()
    } finally {
      ROUTER.push(SIGN_IN_ROUTE)
      ROUTER.refresh()
    }
  }, [ROUTER])

  return { signOut: SignOut, pending: PENDING }
}

export { useMainSignOut }
