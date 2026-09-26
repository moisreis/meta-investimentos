import type { Metadata } from "next"

import { BuildPositionLookups } from "@/presentation/routes/position/helpers/build-position-lookups.helper"
import { EMPTY_POSITION_LOOKUPS } from "@/presentation/routes/position/helpers/build-position-lookups.helper"
import { LoadPositions } from "@/presentation/routes/position/helpers/load-positions.helper"
import { PositionList } from "@/presentation/routes/position/pages/list"
import type { PositionLookups } from "@/presentation/routes/position/types/position-list.types"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

export const metadata: Metadata = {
  title: "Posições",
}

export default async function PositionRoutePage() {
  let POSITIONS: PositionResponseDTO[] | null = null
  let LOOKUPS: PositionLookups = EMPTY_POSITION_LOOKUPS

  const LOADED = await LoadPositions()

  if (LOADED) {
    POSITIONS = LOADED.positions
    LOOKUPS = BuildPositionLookups(LOADED)
  }

  return <PositionList data={POSITIONS} lookups={LOOKUPS} />
}
