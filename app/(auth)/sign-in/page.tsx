import { Metadata } from "next"
import { SignInPage } from "@/presentation/routes/auth/pages/sign-in-page"

// Stores page metadata for **Next.js**.
// Configures title for the sign-up route.
export const metadata: Metadata = {
  title: "Entrar",
}

/**
 * @summary
 * Renders the sign-in route page.
 *
 * @remarks
 * The page delegates its content to **SignInPage**.
 * The authentication layout provides the page frame.
 *
 * @explanation
 * This page connects the sign-in route to the shared sign-in
 * page component in the presentation layer. Use it to keep
 * route wiring separate from component code.
 *
 * @returns The sign-in page content.
 *
 * @example
 * <SignInRoutePage />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-14
 */
export default function SignInRoutePage() {
  return <SignInPage />
}
