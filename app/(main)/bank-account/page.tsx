import type { Metadata } from "next"

import { LoadBankAccountPageProps } from "@/presentation/routes/bank-account/helpers/load-bank-account-page-props.helper"
import { BankAccountList } from "@/presentation/routes/bank-account/pages/list"

export const metadata: Metadata = {
  title: "Contas bancárias",
}

export default async function BankAccountRoutePage() {
  const PROPS = await LoadBankAccountPageProps()

  return <BankAccountList {...PROPS} />
}