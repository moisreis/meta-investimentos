import type { Metadata } from "next"

import { FundContainer } from "@/presentation/composition/fund.container"
import { BuildFundNameLookups } from "@/presentation/routes/fund/helpers/build-fund-name-lookups.helper"
import { BuildFundRowSummaries } from "@/presentation/routes/fund/helpers/build-fund-row-summaries.helper"
import { LoadFunds } from "@/presentation/routes/fund/helpers/load-funds.helper"
import { FundList } from "@/presentation/routes/fund/pages/list"
import type {
  FundNameLookups,
  FundRowSummary,
  FundSelectOptions,
} from "@/presentation/routes/fund/types/fund-list.types"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

export const metadata: Metadata = {
  title: "Fundos",
}

export default async function FundsRoutePage() {
  let FUNDS: FundResponseDTO[] | null = null
  let OPTIONS: FundSelectOptions | null = null
  let SUMMARIES: Record<string, FundRowSummary> = {}
  let NAMES: FundNameLookups = {
    banks: {},
    benchmarks: {},
    categories: {},
  }

  const LOADED = await LoadFunds()

  if (LOADED) {
    FUNDS = LOADED.funds
    OPTIONS = {
      banks: LOADED.banks,
      benchmarks: LOADED.benchmarks,
      categories: LOADED.categories,
    }
    NAMES = BuildFundNameLookups(
      LOADED.banks,
      LOADED.benchmarks,
      LOADED.categories
    )

    const { listRowSummaries: LIST_ROW_SUMMARIES } =
      FundContainer()
    const ROW_SUMMARIES = await LIST_ROW_SUMMARIES.execute({
      fundIds: FUNDS.map((fund) => fund.id),
    })

    SUMMARIES = BuildFundRowSummaries(FUNDS, ROW_SUMMARIES)
  }

  return (
    <FundList
      data={FUNDS}
      options={OPTIONS}
      summaries={SUMMARIES}
      names={NAMES}
    />
  )
}
