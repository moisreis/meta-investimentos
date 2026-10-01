import { SharedAuthFormSkeleton } from "@/presentation/parts/feedback/shared-auth-form-skeleton"

/**
 * @summary
 * Streams the authentication screens.
 *
 * @remarks
 * The authentication group has no shell to keep stable, so
 * the fallback is the card itself, centred where the real one
 * lands.
 *
 * @returns The authentication screen placeholder.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function AuthLoading() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <SharedAuthFormSkeleton />
    </div>
  )
}
