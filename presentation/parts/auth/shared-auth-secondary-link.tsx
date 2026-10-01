import Link from "next/link"

interface SharedAuthSecondaryLinkProps {
  // Invitation shown before the link.
  text: string

  // Screen the link leads to.
  href: string

  // Label of the link itself.
  linkLabel: string
}

/**
 * @summary
 * Renders the invitation that links two auth screens.
 *
 * @remarks
 * The sign in screen invites the reader to sign up, and the
 * sign up screen invites them back. Which way the link points
 * is the route's decision, so this renderer takes the wording
 * and the destination as props and never reads the pathname
 * itself: a primitive that inspected the route would decide
 * where the reader goes.
 *
 * @explanation
 * Use in the footer of an auth card to point at the other
 * auth screen.
 *
 * @param props - Props of the secondary link.
 * @param props.text - Invitation shown before the link.
 * @param props.href - Screen the link leads to.
 * @param props.linkLabel - Label of the link.
 *
 * @returns The invitation and link.
 *
 * @example
 * <SharedAuthSecondaryLink
 *   text={SIGN_IN.DOES_NOT_HAVE_AN_ACCOUNT_TEXT}
 *   href={AUTH_SIGN_UP_PATH}
 *   linkLabel={SIGN_IN.DOES_NOT_HAVE_AN_ACCOUNT_LINK}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function SharedAuthSecondaryLink({
  text,
  href,
  linkLabel,
}: SharedAuthSecondaryLinkProps) {
  return (
    <p className="text-sm text-muted-foreground">
      {text}{" "}
      <Link
        href={href}
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        {linkLabel}
      </Link>
    </p>
  )
}

export { SharedAuthSecondaryLink }
