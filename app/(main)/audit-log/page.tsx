import type { Metadata } from "next"

import { LoadAuditLogPageProps } from "@/presentation/routes/audit-log/helpers/load-audit-log-page-props.helper"
import { AuditLogList } from "@/presentation/routes/audit-log/pages/list"

export const metadata: Metadata = {
  title: "Atividades do sistema",
}

/**
 * @summary
 * Route page of the audit log list screen.
 *
 * @remarks
 * Loads the props of the screen on the server, so the
 * first paint already carries the data, and hands them
 * to the route page that composes the screen. The page
 * itself only decides the title and the entry point, so
 * the same route page can be rendered from anywhere.
 *
 * @returns The route page of the screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export default async function AuditLogsRoutePage() {
  const PROPS = await LoadAuditLogPageProps()

  return <AuditLogList {...PROPS} />
}
