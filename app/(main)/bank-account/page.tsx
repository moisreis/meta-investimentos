import type { Metadata } from "next"

import { LoadBankAccountPageProps } from "@/presentation/routes/bank-account/helpers/load-bank-account-page-props.helper"
import { BankAccountList } from "@/presentation/routes/bank-account/pages/list"

export const metadata: Metadata = {
  title: "Contas bancárias",
}

/**
 * @summary
 * Route page of the bank account list screen.
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
export default async function BankAccountRoutePage() {
  const PROPS = await LoadBankAccountPageProps()

  return <BankAccountList {...PROPS} />
}
