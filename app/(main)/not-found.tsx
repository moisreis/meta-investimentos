import { SharedNotFoundPanel } from "@/presentation/parts/feedback/shared-not-found-panel"

/**
 * @summary
 * Renders the missing screen inside the signed-in shell.
 *
 * @remarks
 * A signed-in reader who lands on an address the application
 * does not serve keeps their navigation, so the way out is
 * one click away rather than a browser back.
 *
 * @returns The not-found screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function MainNotFound() {
  return <SharedNotFoundPanel />
}
