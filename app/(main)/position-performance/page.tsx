import type { Metadata } from "next"

import { LoadPositionPerformancePageProps } from "@/presentation/routes/position-performance/helpers/load-position-performance-page-props.helper"
import { PositionPerformanceList } from "@/presentation/routes/position-performance/pages/list"

export const metadata: Metadata = {
  title: "Desempenho",
}

/**
 * @summary
 * Route page of the position performance list screen.
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
export default async function PositionPerformanceRoutePage() {
  const PROPS = await LoadPositionPerformancePageProps()

  return <PositionPerformanceList {...PROPS} />
}
