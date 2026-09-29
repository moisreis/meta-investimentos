import type { Metadata } from "next"

import { LoadBankPageProps } from "@/presentation/routes/bank/helpers/load-bank-page-props.helper"
import { BankList } from "@/presentation/routes/bank/pages/list"

export const metadata: Metadata = {
  title: "Bancos",
}

export default async function BanksRoutePage() {
  const PROPS = await LoadBankPageProps()

  return <BankList {...PROPS} />
}