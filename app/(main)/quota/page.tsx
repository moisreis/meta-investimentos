import type { Metadata } from "next"

import { LoadQuotaPageProps } from "@/presentation/routes/quota/helpers/load-quota-page-props.helper"
import { QuotaList } from "@/presentation/routes/quota/pages/list"

export const metadata: Metadata = {
  title: "Registros de cotas",
}

export default async function QuotaRoutePage() {
  const PROPS = await LoadQuotaPageProps()

  return <QuotaList {...PROPS} />
}