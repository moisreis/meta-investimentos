"use client"

import { SharedAuthBackdrop } from "@/presentation/parts/auth/shared-auth-backdrop"
import { SharedAuthCard } from "@/presentation/parts/auth/shared-auth-card"
import { SharedAuthCopyright } from "@/presentation/parts/auth/shared-auth-copyright"
import { SharedAuthFluidBackdrop } from "@/presentation/parts/auth/shared-auth-fluid-backdrop"
import { SharedAuthSecondaryLink } from "@/presentation/parts/auth/shared-auth-secondary-link"
import { SharedAuthShell } from "@/presentation/parts/auth/shared-auth-shell"

import { useAuthSecondaryLink } from "../hooks/use-auth-secondary-link.hook"
import { AUTH_COPYRIGHT } from "../settings/labels.settings"

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
 * The frame is a client component because the secondary link
 * reads the pathname to decide which way it points, and the
 * sign-in and sign-up pages are the only two destinations it
 * has to tell apart.
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
function AuthShell({
  children,
  description,
  title,
}: AuthShellProps) {
  const LINK = useAuthSecondaryLink()

  return (
    <SharedAuthShell>
      <SharedAuthBackdrop>
        <SharedAuthFluidBackdrop />

        <SharedAuthCard
          title={title}
          description={description}
          footer={
            <SharedAuthSecondaryLink
              text={LINK.text}
              href={LINK.href}
              linkLabel={LINK.linkLabel}
            />
          }
        >
          {children}
        </SharedAuthCard>
      </SharedAuthBackdrop>

      <SharedAuthCopyright text={AUTH_COPYRIGHT} />
    </SharedAuthShell>
  )
}

export { AuthShell }
