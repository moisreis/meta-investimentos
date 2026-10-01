import type { Metadata } from "next"

import { LoadStatementPageProps } from "@/presentation/routes/statement/helpers/load-statement-page-props.helper"
import { StatementList } from "@/presentation/routes/statement/pages/list"

export const metadata: Metadata = {
  title: "Relat",
}

/**
 * @summary
 * Route page of the statement list screen.
 *
 * @remarks
 * Loads the props of the screen on the server, so the
 * first paint already carries the data, and hands them
 * to the route page that composes the screen. The page
 * itself only decides the title and the entry point, so
 * the same route page can be rendered from anywhere.
 *
 * @returns The route page of the screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export default async function StatementsRoutePage() {
  const PROPS = await LoadStatementPageProps()

  return <StatementList {...PROPS} />
}
