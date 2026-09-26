import type { Metadata } from "next"

import { LoadSessionAuditLogs } from "@/presentation/routes/audit-log/helpers/load-session-audit-logs.helper"
import { AuditLogList } from "@/presentation/routes/audit-log/pages/list"

export const metadata: Metadata = {
  title: "Atividades do sistema",
}

export default async function AuditLogsRoutePage() {
  const BUNDLE = await LoadSessionAuditLogs()

  return (
    <>
      <AuditLogList
        data={BUNDLE?.auditLogs ?? null}
        summaries={BUNDLE?.summaries ?? null}
      />
    </>
  )
}
