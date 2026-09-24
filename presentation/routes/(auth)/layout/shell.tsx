import { AuthCopyright } from "@/presentation/parts/components/auth-copyright"
import { AuthShellWrapper } from "@/presentation/parts/components/auth-shell-wrapper"
import { AuthBackgroundWrapper } from "@/presentation/parts/components/auth-background-wrapper"
import { AuthFluidBackground } from "@/presentation/parts/components/auth-fluid-background"
import { AuthCard } from "@/presentation/parts/components/auth-card"

interface AuthShellProps {
  // Content rendered inside the card body.
  children: React.ReactNode

  // Short description below the card title.
  description: string

  // Title of the authentication screen.
  title: string
}

/**
 * @summary
 * Renders the shared authentication screen frame.
 *
 * @remarks
 * Composes the **AsciiFluid** background, a centered **Card**
 * with title, description and children, plus the secondary
 * link footer and the brand copyright notice.
 *
 * @explanation
 * Use this layout for the sign-in and sign-up routes to keep
 * a single visual frame across the authentication screens.
 * Pass the route-specific labels through the props.
 *
 * @param props - Props of the **AuthShell** component.
 * @param props.children - Content rendered inside the card body.
 * @param props.description - Short description below the
 *                            card title.
 * @param props.title - Title of the authentication screen.
 *
 * @returns The auth screen frame.
 *
 * @example
 * <AuthShell title="Entrar" description="Acesse sua conta.">
 *   <SignInPage />
 * </AuthShell>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function AuthShell({ children, description, title }: AuthShellProps) {
  return (
    <AuthShellWrapper>
      <AuthBackgroundWrapper>
        <AuthFluidBackground />
        <AuthCard title={title} description={description}>
          {children}
        </AuthCard>
      </AuthBackgroundWrapper>
      <AuthCopyright />
    </AuthShellWrapper>
  )
}

export { AuthShell }
