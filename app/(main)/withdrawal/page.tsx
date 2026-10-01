import type { Metadata } from "next"

import { LoadWithdrawalPageProps } from "@/presentation/routes/withdrawal/helpers/load-withdrawal-page-props.helper"
import { WithdrawalList } from "@/presentation/routes/withdrawal/pages/list"

export const metadata: Metadata = {
  title: "Resgates",
}

/**
 * @summary
 * Route page of the withdrawal list screen.
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
export default async function WithdrawalRoutePage() {
  const PROPS = await LoadWithdrawalPageProps()

  return <WithdrawalList {...PROPS} />
}
