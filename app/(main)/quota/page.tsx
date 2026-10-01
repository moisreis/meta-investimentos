import type { Metadata } from "next"

import { LoadQuotaPageProps } from "@/presentation/routes/quota/helpers/load-quota-page-props.helper"
import { QuotaList } from "@/presentation/routes/quota/pages/list"

export const metadata: Metadata = {
  title: "Registros de cotas",
}

/**
 * @summary
 * Route page of the quota list screen.
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
export default async function QuotaRoutePage() {
  const PROPS = await LoadQuotaPageProps()

  return <QuotaList {...PROPS} />
}
