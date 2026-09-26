import type { Metadata } from "next"

import { BuildBankAccountNameLookups } from "@/presentation/routes/bank-account/helpers/build-bank-account-name-lookups.helper"
import { BuildBankAccountRowSummaries } from "@/presentation/routes/bank-account/helpers/build-bank-account-row-summaries.helper"
import { LoadBankAccounts } from "@/presentation/routes/bank-account/helpers/load-bank-accounts.helper"
import { BankAccountList } from "@/presentation/routes/bank-account/pages/list"
import type {
  BankAccountNameLookups,
  BankAccountRowSummary,
  BankAccountSelectOptions,
} from "@/presentation/routes/bank-account/types/bank-account-list.types"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

export const metadata: Metadata = {
  title: "Contas bancárias",
}

export default async function BankAccountRoutePage() {
  let ACCOUNTS: BankAccountResponseDTO[] | null = null
  let OPTIONS: BankAccountSelectOptions | null = null
  let SUMMARIES: Record<string, BankAccountRowSummary> | null =
    null
  let NAMES: BankAccountNameLookups = {
    bankAccounts: {},
  }

  const LOADED = await LoadBankAccounts()

  if (LOADED) {
    ACCOUNTS = LOADED.bankAccounts
    OPTIONS = {
      portfolios: LOADED.portfolios,
      banks: LOADED.banks,
    }
    SUMMARIES = BuildBankAccountRowSummaries(
      LOADED.bankAccounts,
      LOADED.entries
    )
    NAMES = BuildBankAccountNameLookups(
      LOADED.bankAccounts,
      LOADED.banks,
      LOADED.portfolios
    )
  }

  return (
    <BankAccountList
      data={ACCOUNTS}
      options={OPTIONS}
      names={NAMES}
      summaries={SUMMARIES}
    />
  )
}
