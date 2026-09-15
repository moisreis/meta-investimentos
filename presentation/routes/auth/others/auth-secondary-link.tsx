"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIGN_IN, SIGN_UP } from "../settings/form-labels.settings";

/**
 * @summary
 * Renders the secondary link for the auth routes.
 *
 * @remarks
 * The link invites users to the opposite auth screen.
 * It reads the labels from the form route settings.
 *
 * @explanation
 * This link helps users switch between the auth screens.
 * It uses the pathname to pick the matching label set.
 * Use it inside the authentication card footer.
 *
 * @returns The secondary auth link prompt.
 *
 * @example
 * <AuthSecondaryLink />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-14
 */
function AuthSecondaryLink() {
  // Stores the current authentication route pathname.
  const PATHNAME = usePathname();

  // Renders the link that points back to sign-in.
  if (PATHNAME === "/sign-up") {
    const { ALREADY_HAVE_AN_ACCOUNT_TEXT, ALREADY_HAVE_AN_ACCOUNT_LINK } = SIGN_UP;
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
    );
  }

  // Renders the link that points forward to sign-up.
  const { DOES_NOT_HAVE_AN_ACCOUNT_TEXT, DOES_NOT_HAVE_AN_ACCOUNT_LINK } = SIGN_IN;
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
  );
}

export { AuthSecondaryLink }
