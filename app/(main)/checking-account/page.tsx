import type { Metadata } from "next"

import { LoadCheckingAccountPageProps } from "@/presentation/routes/checking-account/helpers/load-checking-account-page-props.helper"
import { CheckingAccountList } from "@/presentation/routes/checking-account/pages/list"

export const metadata: Metadata = {
  title: "Contas correntes",
}

/**
 * @summary
 * Route page of the checking account list screen.
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
export default async function CheckingAccountRoutePage() {
  const PROPS = await LoadCheckingAccountPageProps()

  return <CheckingAccountList {...PROPS} />
}
