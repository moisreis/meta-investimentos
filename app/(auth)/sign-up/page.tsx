import type { Metadata } from "next"
import { SignUpPage } from "@/presentation/routes/(auth)/pages/sign-up"

// Stores page metadata for **Next.js**.
// Configures title for the sign-up route.
export const metadata: Metadata = {
  title: "Criar Conta",
}

/**
 * @summary
 * Renders the sign-up route page.
 *
 * @remarks
 * The page delegates its content to **SignUpPage**.
 * The authentication layout provides the page frame.
 *
 * @explanation
 * This page connects the sign-up route to the shared sign-up
 * page component in the presentation layer. Use it to keep
 * route wiring separate from component code.
 *
 * @returns The sign-up page content.
 *
 * @example
 * <SignUpRoutePage />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export default function SignUpRoutePage() {
  return <SignUpPage />
}
