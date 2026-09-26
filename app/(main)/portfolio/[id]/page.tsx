import type { Metadata } from "next"

import { LoadPortfolioAcronym } from "@/presentation/routes/portfolio/helpers/load-portfolio-acronym.helper"
import { LoadPortfolioOverview } from "@/presentation/routes/portfolio/helpers/load-portfolio-overview.helper"
import PortfolioPage from "@/presentation/routes/portfolio/pages/page"
import type { PortfolioOverviewData } from "@/presentation/routes/portfolio/types/portfolio-overview.types"

// Title shown when the portfolio cannot be resolved.
const FALLBACK_TITLE = "Carteira"

interface PortfolioIdPageParams {
  id: string
}

/**
 * @summary
 * Resolves the metadata of the portfolio detail route.
 *
 * @remarks
 * Uses the portfolio acronym as the page title so the
 * browser tab reflects the resolved portfolio. Falls back
 * to a neutral title when the portfolio cannot be found.
 *
 * @param props - The route parameters.
 * @param props.params - Promise of the route parameters
 * with the portfolio id.
 *
 * @returns The resolved page metadata.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<PortfolioIdPageParams>
}): Promise<Metadata> {
  const { id: PORTFOLIO_ID } = await params
  const ACRONYM = await LoadPortfolioAcronym(PORTFOLIO_ID)

  return { title: ACRONYM ?? FALLBACK_TITLE }
}

export default async function PortfoliosIdPage({
  params,
}: {
  params: Promise<PortfolioIdPageParams>
}) {
  const { id: PORTFOLIO_ID } = await params
  const DATA: PortfolioOverviewData | null =
    await LoadPortfolioOverview(PORTFOLIO_ID)

  return <PortfolioPage data={DATA} />
}
