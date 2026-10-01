import { renderToBuffer } from "@react-pdf/renderer"

import type { StatementReportData } from "@/services/statement/report/statement-report.types"

import { BuildStatementReportDocument } from "./shared-statement-report-document"

/**
 * @summary
 * Renders the statement report into PDF bytes.
 *
 * @remarks
 * Renders the document through `renderToBuffer` and
 * copies the Node buffer into a plain `Uint8Array`,
 * which stays safe to pass to a `Response` body or to
 * upload to object storage.
 *
 * @explanation
 * Use this function anywhere a finished statement
 * file is needed, such as a route handler or the
 * statement generate job.
 *
 * @param data - The report model to render.
 *
 * @returns The PDF file bytes.
 *
 * @example
 * const BYTES = await RenderStatementPdf(DATA);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export async function RenderStatementPdf(
  data: StatementReportData
): Promise<Uint8Array<ArrayBuffer>> {
  const BUFFER = await renderToBuffer(
    BuildStatementReportDocument(data)
  )
  return new Uint8Array(BUFFER)
}
