"use client"

import { usePathname } from "next/navigation"

import { SIGN_IN, SIGN_UP } from "../settings/labels.settings"

// The two auth screens, named once so the comparison below
// and the destinations it returns cannot disagree.
const SIGN_UP_PATH = "/sign-up"
const SIGN_IN_PATH = "/sign-in"

/**
 * @summary
 * Decides which way the link between the auth screens points.
 *
 * @remarks
 * The sign up screen invites the reader back to sign in, and
 * every other auth screen invites them forward to sign up.
 * Reading the pathname here keeps that decision in one place:
 * the primitive that renders the link is handed a destination
 * rather than working it out for itself.
 *
 * @explanation
 * Use in the auth shell, which renders the link in the card
 * footer. Call it once and pass the three values to
 * `SharedAuthSecondaryLink`.
 *
 * @returns The invitation text, the destination, and the label.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useAuthSecondaryLink() {
  const PATHNAME = usePathname()

  if (PATHNAME === SIGN_UP_PATH) {
    const {
      ALREADY_HAVE_AN_ACCOUNT_TEXT,
      ALREADY_HAVE_AN_ACCOUNT_LINK,
    } = SIGN_UP

    return {
      text: ALREADY_HAVE_AN_ACCOUNT_TEXT,
      href: SIGN_IN_PATH,
      linkLabel: ALREADY_HAVE_AN_ACCOUNT_LINK,
    }
  }

  return {
    text: SIGN_IN.DOES_NOT_HAVE_AN_ACCOUNT_TEXT,
    href: SIGN_UP_PATH,
    linkLabel: SIGN_IN.DOES_NOT_HAVE_AN_ACCOUNT_LINK,
  }
}

export { useAuthSecondaryLink }
