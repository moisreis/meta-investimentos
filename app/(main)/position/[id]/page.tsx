import type { Metadata } from "next"

import { LoadPositionName } from "@/presentation/routes/position/helpers/load-position-name.helper"
import { LoadPositionOverview } from "@/presentation/routes/position/helpers/load-position-overview.helper"
import { PositionDetail } from "@/presentation/routes/position/pages/detail"
import type { PositionOverviewData } from "@/presentation/routes/position/types/position-overview.types"

// Title shown when the position cannot be resolved.
const FALLBACK_TITLE = "Posição"

interface PositionIdPageParams {
  id: string
}

/**
 * @summary
 * Resolves the metadata of the position detail route.
 *
 * @remarks
 * Uses the fund name of the position as the page title so
 * the browser tab reflects the resolved position. Falls back
 * to a neutral title when the position cannot be found.
 *
 * @param props - The route parameters.
 * @param props.params - Promise of the route parameters with
 * the position id.
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
  params: Promise<PositionIdPageParams>
}): Promise<Metadata> {
  const { id: POSITION_ID } = await params
  const NAME = await LoadPositionName(POSITION_ID)

  return { title: NAME ?? FALLBACK_TITLE }
}

export default async function PositionIdPage({
  params,
}: {
  params: Promise<PositionIdPageParams>
}) {
  const { id: POSITION_ID } = await params
  const DATA: PositionOverviewData | null =
    await LoadPositionOverview(POSITION_ID)

  return <PositionDetail data={DATA} />
}
