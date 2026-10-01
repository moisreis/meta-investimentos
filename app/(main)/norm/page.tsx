import type { Metadata } from "next"

import { LoadNormPageProps } from "@/presentation/routes/norm/helpers/load-norm-page-props.helper"
import { NormList } from "@/presentation/routes/norm/pages/list"

export const metadata: Metadata = {
  title: "Normas",
}

/**
 * @summary
 * Route page of the norm list screen.
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
 * @date 2026-10-01
 */
export default async function NormsRoutePage() {
  const PROPS = await LoadNormPageProps()

  return <NormList {...PROPS} />
}
