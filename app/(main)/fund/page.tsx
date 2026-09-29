import type { Metadata } from "next"

import { LoadFundPageProps } from "@/presentation/routes/fund/helpers/load-fund-page-props.helper"
import { FundList } from "@/presentation/routes/fund/pages/list"

export const metadata: Metadata = {
  title: "Fundos",
}

export default async function FundsRoutePage() {
  const PROPS = await LoadFundPageProps()

  return <FundList {...PROPS} />
}