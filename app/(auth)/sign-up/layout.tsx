import { AuthLayout } from "@/presentation/routes/(auth)/layout/layout"
import { SIGN_UP } from "@/presentation/routes/(auth)/settings/labels.settings"

/**
 * @summary
 * Renders the sign-up route layout.
 *
 * @remarks
 * The layout passes the sign-up description to **AuthLayout**.
 * The authentication pages render inside the card frame.
 *
 * @explanation
 * This layout wires the sign-up route to the shared authentication
 * layout component and its route-specific label settings.
 * Use it to keep route wiring separate from component code.
 *
 * @param props - Props of the sign-up layout.
 * @param props.children - Content rendered inside the frame.
 * @returns The sign-up layout frame.
 *
 * @example
 * <SignUpRouteLayout>
 *   <SignUpPage />
 * </SignUpRouteLayout>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export default function SignUpRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthLayout
      description={SIGN_UP.SIGN_UP_DESCRIPTION}
      title={SIGN_UP.SIGN_UP_TITLE}
    >
      {children}
    </AuthLayout>
  )
}
