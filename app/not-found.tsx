import { SharedNotFoundPanel } from "@/presentation/parts/feedback/shared-not-found-panel"

/**
 * @summary
 * Renders the screen for an address the application does not
 * recognise.
 *
 * @remarks
 * This is the fallback for any unmatched path, signed in or
 * not, so it renders inside the root layout and stands on
 * its own. The panel reads the requested pathname itself, so
 * the reader can see which address missed.
 *
 * @returns The not-found screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function NotFound() {
  return (
    <main className="flex min-h-svh w-full flex-col bg-background">
      <SharedNotFoundPanel />
    </main>
  )
}
