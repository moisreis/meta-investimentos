import type { Metadata } from "next"

import { BuildWithdrawalLookups } from "@/presentation/routes/withdrawal/helpers/build-withdrawal-lookups.helper"
import { EMPTY_WITHDRAWAL_LOOKUPS } from "@/presentation/routes/withdrawal/helpers/build-withdrawal-lookups.helper"
import { LoadWithdrawals } from "@/presentation/routes/withdrawal/helpers/load-withdrawals.helper"
import { WithdrawalList } from "@/presentation/routes/withdrawal/pages/list"
import type { WithdrawalLookups } from "@/presentation/routes/withdrawal/types/withdrawal-list.types"
import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"

export const metadata: Metadata = {
  title: "Resgates",
}

export default async function WithdrawalRoutePage() {
  let WITHDRAWALS: WithdrawalResponseDTO[] | null = null
  let LOOKUPS: WithdrawalLookups = EMPTY_WITHDRAWAL_LOOKUPS

  const LOADED = await LoadWithdrawals()

  if (LOADED) {
    WITHDRAWALS = LOADED.withdrawals
    LOOKUPS = BuildWithdrawalLookups(LOADED)
  }

  return <WithdrawalList data={WITHDRAWALS} lookups={LOOKUPS} />
}
