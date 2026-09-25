import type { Metadata } from "next"

import { BuildQuotaFundLookups } from "@/presentation/routes/quota/helpers/build-quota-fund-lookups.helper"
import { LoadQuotas } from "@/presentation/routes/quota/helpers/load-quotas.helper"
import { QuotaList } from "@/presentation/routes/quota/pages/list"
import type { QuotaFundLookups } from "@/presentation/routes/quota/types/quota-list.types"
import type { QuotaResponseDTO } from "@/services/quota/dto/quota-response.dto"

export const metadata: Metadata = {
  title: "Registros de cotas",
}

export default async function QuotaRoutePage() {
  let QUOTAS: QuotaResponseDTO[] | null = null
  let LOOKUPS: QuotaFundLookups = { quotas: {} }

  const LOADED = await LoadQuotas()

  if (LOADED) {
    QUOTAS = LOADED.quotas
    LOOKUPS = BuildQuotaFundLookups(LOADED.quotas, LOADED.funds)
  }

  return <QuotaList data={QUOTAS} lookups={LOOKUPS} />
}
