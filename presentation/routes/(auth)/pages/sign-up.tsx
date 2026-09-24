import { SignUpForm } from "../forms/sign-up"

/**
 * @summary
 * Renders the sign-up page content.
 *
 * @remarks
 * The page presents the sign-up form and a sign-in link.
 * It acts as the entry point to the registration flow.
 *
 * @explanation
 * This page assembles the sign-up screen from its pieces.
 * It renders the page title and the **SignUpForm** component.
 * Use it as the content of the sign-up route.
 *
 * @returns The sign-up page content.
 *
 * @example
 * <SignUpPage />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function SignUpPage() {
  return <SignUpForm />
}

export { SignUpPage }
