import { AuthLayout } from "@/presentation/routes/auth/layout/auth-layout"
import { SIGN_IN } from "@/presentation/routes/auth/settings/form-labels.settings"

/**
 * @summary
 * Renders the sign-in route layout.
 *
 * @remarks
 * The layout passes the sign-in description to **AuthLayout**.
 * The authentication pages render inside the card frame.
 *
 * @explanation
 * This layout wires the sign-in route to the shared authentication
 * layout component and its route-specific label settings.
 * Use it to keep route wiring separate from component code.
 *
 * @param props - Props of the sign-in layout.
 * @param props.children - Content rendered inside the frame.
 * @returns The sign-in layout frame.
 *
 * @example
 * <SignInRouteLayout>
 *   <SignInPage />
 * </SignInRouteLayout>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-14
 */
export default function SignInRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthLayout
      description={SIGN_IN.SIGN_IN_DESCRIPTION}
      title={SIGN_IN.SIGN_IN_TITLE}
    >
      {children}
    </AuthLayout>
  )
}
