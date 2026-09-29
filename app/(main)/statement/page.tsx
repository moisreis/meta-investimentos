import type { Metadata } from "next"

import { LoadStatementPageProps } from "@/presentation/routes/statement/helpers/load-statement-page-props.helper"
import { StatementList } from "@/presentation/routes/statement/pages/list"

export const metadata: Metadata = {
  title: "Relat",
}

export default async function StatementsRoutePage() {
  const PROPS = await LoadStatementPageProps()

  return <StatementList {...PROPS} />
}