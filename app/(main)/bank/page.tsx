import type { Metadata } from "next"

import { BankAccountContainer } from "@/presentation/composition/bank-account.container"
import { BuildBankRowSummaries } from "@/presentation/routes/bank/helpers/build-bank-row-summaries.helper"
import { LoadBanks } from "@/presentation/routes/bank/helpers/load-banks.helper"
import { BankList } from "@/presentation/routes/bank/pages/list"
import type { BankRowSummary } from "@/presentation/routes/bank/types/bank-list.types"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"

export const metadata: Metadata = {
  title: "Bancos",
}

export default async function BanksRoutePage() {
  let BANKS: BankResponseDTO[] | null = null
  let SUMMARIES: Record<string, BankRowSummary> = {}

  const BANKS_LOADED = await LoadBanks()

  if (BANKS_LOADED) {
    BANKS = BANKS_LOADED

    const BANK_IDS = BANKS.map((bank) => bank.id)
    const { listBankRowSummaries: LIST_ROW_SUMMARIES } =
      BankAccountContainer()
    const ROW_SUMMARIES = await LIST_ROW_SUMMARIES.execute({
      bankIds: BANK_IDS,
    })

    SUMMARIES = BuildBankRowSummaries(BANKS, ROW_SUMMARIES)
  }

  return (
    <>
      <BankList data={BANKS} summaries={SUMMARIES} />
    </>
  )
}
