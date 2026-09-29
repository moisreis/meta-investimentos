import type { Metadata } from "next"

import { LoadAuditLogPageProps } from "@/presentation/routes/audit-log/helpers/load-audit-log-page-props.helper"
import { AuditLogList } from "@/presentation/routes/audit-log/pages/list"

export const metadata: Metadata = {
  title: "Atividades do sistema",
}

export default async function AuditLogsRoutePage() {
  const PROPS = await LoadAuditLogPageProps()

  return <AuditLogList {...PROPS} />
}