import type { Metadata } from "next"

import { LoadPositionPageProps } from "@/presentation/routes/position/helpers/load-position-page-props.helper"
import { PositionList } from "@/presentation/routes/position/pages/list"

export const metadata: Metadata = {
  title: "Posições",
}

export default async function PositionRoutePage() {
  const PROPS = await LoadPositionPageProps()

  return <PositionList {...PROPS} />
}