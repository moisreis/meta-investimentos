import type { Metadata } from "next"

import { BuildCheckingAccountNameLookups } from "@/presentation/routes/checking-account/helpers/build-checking-account-name-lookups.helper"
import { LoadCheckingAccounts } from "@/presentation/routes/checking-account/helpers/load-checking-accounts.helper"
import { CheckingAccountList } from "@/presentation/routes/checking-account/pages/list"
import type {
  CheckingAccountNameLookups,
  CheckingAccountSelectOptions,
} from "@/presentation/routes/checking-account/types/checking-account-list.types"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

export const metadata: Metadata = {
  title: "Contas correntes",
}

export default async function CheckingAccountRoutePage() {
  let ENTRIES: CheckingAccountResponseDTO[] | null = null
  let OPTIONS: CheckingAccountSelectOptions | null = null
  let NAMES: CheckingAccountNameLookups = {
    bankAccounts: {},
  }

  const LOADED = await LoadCheckingAccounts()

  if (LOADED) {
    ENTRIES = LOADED.entries
    OPTIONS = {
      bankAccounts: LOADED.bankAccounts,
      banks: LOADED.banks,
    }
    NAMES = BuildCheckingAccountNameLookups(
      LOADED.bankAccounts,
      LOADED.banks
    )
  }

  return (
    <CheckingAccountList
      data={ENTRIES}
      options={OPTIONS}
      names={NAMES}
    />
  )
}
