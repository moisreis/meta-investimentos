import type { Metadata } from "next"

import { LoadWithdrawalPageProps } from "@/presentation/routes/withdrawal/helpers/load-withdrawal-page-props.helper"
import { WithdrawalList } from "@/presentation/routes/withdrawal/pages/list"

export const metadata: Metadata = {
  title: "Resgates",
}

export default async function WithdrawalRoutePage() {
  const PROPS = await LoadWithdrawalPageProps()

  return <WithdrawalList {...PROPS} />
}