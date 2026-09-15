/**
 * @summary
 * Keeps the root page without rendered content.
 *
 * @remarks
 * The root route has no application entry point.
 * Main and authentication flows use dedicated routes.
 *
 * @explanation
 * This page exists to keep the root route intentionally empty.
 * The application starts from `/main` or authentication routes.
 * Use those routes for the main and authentication entry points.
 *
 * @returns No rendered content.
 *
 * @example
 * export default function RootPage() {
 *   return null;
 * }
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export default function RootPage() {
  return null
}
