import { SignInForm } from "../forms/sign-in"

/**
 * @summary
 * Renders the sign-in page content.
 *
 * @remarks
 * The page presents the sign-in form and a sign-up link.
 * It acts as the entry point to the authentication flow.
 *
 * @explanation
 * This page assembles the sign-in screen from its pieces.
 * It renders the page title and the **SignInForm** component.
 * Use it as the content of the sign-in route.
 *
 * @returns The sign-in page content.
 *
 * @example
 * <SignInPage />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function SignInPage() {
  return <SignInForm />
}

export { SignInPage }