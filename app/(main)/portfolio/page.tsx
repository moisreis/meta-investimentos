import type { Metadata } from "next"

import { LoadPortfolioPageProps } from "@/presentation/routes/portfolio/helpers/load-portfolio-page-props.helper"
import { PortfolioList } from "@/presentation/routes/portfolio/pages/list"

export const metadata: Metadata = {
  title: "Carteiras",
}

/**
 * @summary
 * Route page of the portfolio list screen.
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
export default async function PortfoliosRoutePage() {
  const PROPS = await LoadPortfolioPageProps()

  return <PortfolioList {...PROPS} />
}
