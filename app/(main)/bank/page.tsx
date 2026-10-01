import type { Metadata } from "next"

import { LoadBankPageProps } from "@/presentation/routes/bank/helpers/load-bank-page-props.helper"
import { BankList } from "@/presentation/routes/bank/pages/list"

export const metadata: Metadata = {
  title: "Bancos",
}

/**
 * @summary
 * Route page of the bank list screen.
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
export default async function BanksRoutePage() {
  const PROPS = await LoadBankPageProps()

  return <BankList {...PROPS} />
}
