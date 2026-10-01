import type { Metadata } from "next"

import { LoadFundPageProps } from "@/presentation/routes/fund/helpers/load-fund-page-props.helper"
import { FundList } from "@/presentation/routes/fund/pages/list"

export const metadata: Metadata = {
  title: "Fundos",
}

/**
 * @summary
 * Route page of the fund list screen.
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
export default async function FundsRoutePage() {
  const PROPS = await LoadFundPageProps()

  return <FundList {...PROPS} />
}
