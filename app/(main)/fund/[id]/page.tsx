import type { Metadata } from "next"

import { LoadFundName } from "@/presentation/routes/fund/helpers/load-fund-name.helper"
import { LoadFundOverview } from "@/presentation/routes/fund/helpers/load-fund-overview.helper"
import { FundDetail } from "@/presentation/routes/fund/pages/detail"
import type { FundOverviewData } from "@/presentation/routes/fund/types/fund-overview.types"

// Title shown when the fund cannot be resolved.
const FALLBACK_TITLE = "Fundo"

interface FundIdPageParams {
  id: string
}

/**
 * @summary
 * Resolves the metadata of the fund detail route.
 *
 * @remarks
 * Uses the registered fund name as the page title so the
 * browser tab reflects the resolved fund. Falls back to a
 * neutral title when the fund cannot be found.
 *
 * @param props - The route parameters.
 * @param props.params - Promise of the route parameters
 *   with the fund id.
 *
 * @returns The resolved page metadata.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<FundIdPageParams>
}): Promise<Metadata> {
  const { id: FUND_ID } = await params
  const NAME = await LoadFundName(FUND_ID)

  return { title: NAME ?? FALLBACK_TITLE }
}

export default async function FundsIdPage({
  params,
}: {
  params: Promise<FundIdPageParams>
}) {
  const { id: FUND_ID } = await params
  const DATA: FundOverviewData | null =
    await LoadFundOverview(FUND_ID)

  return <FundDetail data={DATA} />
}
