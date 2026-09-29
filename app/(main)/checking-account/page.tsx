import type { Metadata } from "next"

import { LoadCheckingAccountPageProps } from "@/presentation/routes/checking-account/helpers/load-checking-account-page-props.helper"
import { CheckingAccountList } from "@/presentation/routes/checking-account/pages/list"

export const metadata: Metadata = {
  title: "Contas correntes",
}

export default async function CheckingAccountRoutePage() {
  const PROPS = await LoadCheckingAccountPageProps()

  return <CheckingAccountList {...PROPS} />
}