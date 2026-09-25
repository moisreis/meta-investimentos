import type { Metadata } from "next"

import { db } from "@/clients/database.client"
import { BankAccountRepository } from "@/infrastructure/bank-account/repositories/bank-account.repository"
import { BuildBankRowSummaries } from "@/presentation/routes/bank/helpers/build-bank-row-summaries.helper"
import { LoadBanks } from "@/presentation/routes/bank/helpers/load-banks.helper"
import { BankList } from "@/presentation/routes/bank/pages/list"
import type { BankRowSummary } from "@/presentation/routes/bank/types/bank-list.types"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import { ListBankRowSummariesUseCase } from "@/services/bank/use-cases/list-bank-row-summaries.use-case"

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
    const SUMMARIES_USE_CASE = new ListBankRowSummariesUseCase(
      new BankAccountRepository(db)
    )
    const ROW_SUMMARIES = await SUMMARIES_USE_CASE.execute({
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
