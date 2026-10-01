import type { Metadata } from "next"

import { LoadPositionPageProps } from "@/presentation/routes/position/helpers/load-position-page-props.helper"
import { PositionList } from "@/presentation/routes/position/pages/list"

export const metadata: Metadata = {
  title: "Posições",
}

/**
 * @summary
 * Route page of the position list screen.
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
export default async function PositionRoutePage() {
  const PROPS = await LoadPositionPageProps()

  return <PositionList {...PROPS} />
}
