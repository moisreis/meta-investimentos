"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SIGN_IN,
  SIGN_UP,
} from "../../routes/(auth)/settings/labels.settings"

/**
 * @summary
 * Renders the link between the sign-in and sign-up screens.
 *
 * @remarks
 * Reads the current pathname to decide which invitation text
 * and destination link to render. On the sign-up screen it
 * points back to sign-in and vice versa.
 *
 * @explanation
 * Use this component in the footer of the authentication
 * layout. It keeps the routing logic presentational and free
 * of route-specific labels.
 *
 * @returns The invitation and link.
 *
 * @example
 * <AuthSecondaryLink />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function AuthSecondaryLink() {
  // Stores the current authentication route pathname.
  const PATHNAME = usePathname()

  // Renders the link that points back to sign-in.
  if (PATHNAME === "/sign-up") {
    const {
      ALREADY_HAVE_AN_ACCOUNT_TEXT,
      ALREADY_HAVE_AN_ACCOUNT_LINK,
    } = SIGN_UP

    return (
      <p className="text-sm text-muted-foreground">
        {ALREADY_HAVE_AN_ACCOUNT_TEXT}{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {ALREADY_HAVE_AN_ACCOUNT_LINK}
        </Link>
      </p>
    )
  }

  // Renders the link that points forward to sign-up.
  const {
    DOES_NOT_HAVE_AN_ACCOUNT_TEXT,
    DOES_NOT_HAVE_AN_ACCOUNT_LINK,
  } = SIGN_IN

  return (
    <p className="text-sm text-muted-foreground">
      {DOES_NOT_HAVE_AN_ACCOUNT_TEXT}{" "}
      <Link
        href="/sign-up"
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        {DOES_NOT_HAVE_AN_ACCOUNT_LINK}
      </Link>
    </p>
  )
}

export { AuthSecondaryLink }
