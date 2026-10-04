import { redirect } from "next/navigation"

/**
 * @summary
 * Redirects the root page to the portfolio list.
 *
 * @remarks
 * The application landing is the portfolio list.
 *
 * @returns A redirect to /portfolio.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-03
 */
export default function RootPage() {
  redirect("/portfolio")
}
