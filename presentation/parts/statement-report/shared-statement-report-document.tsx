import { Document, Page } from "@react-pdf/renderer"
import type { DocumentProps } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import type { StatementReportData } from "@/services/statement/report/statement-report.types"

import { StatementReportCoverSection } from "./shared-statement-report-cover"
import { RunningHeader } from "./shared-statement-report-header"
import {
  ClosingNote,
  RunningFooter,
} from "./shared-statement-report-footer"
import { AccumulatedIndexesSection } from "./shared-statement-report-section-accumulated-indexes"
import { AccountsSection } from "./shared-statement-report-section-accounts"
import { ComplianceSection } from "./shared-statement-report-section-compliance"
import { DashboardSection } from "./shared-statement-report-section-dashboard"
import { DistributionsSection } from "./shared-statement-report-section-distributions"
import { FundsSection } from "./shared-statement-report-section-funds"
import {
  AssetTypesSection,
  IndexFiguresSection,
} from "./shared-statement-report-section-index-figures"
import { IndexMonthsSection } from "./shared-statement-report-section-index-months"
import { MonthlySection } from "./shared-statement-report-section-monthly"
import { PerformanceSection } from "./shared-statement-report-section-performance"
import { PositionsSection } from "./shared-statement-report-section-positions"
import { tw } from "./shared-statement-report-styles.constants"

/**
 * @summary
 * Builds the PDF document of the institutional report.
 *
 * @remarks
 * Opens with a cover carrying the brand mark, the
 * institution and the portfolio identification, then flows
 * the report body through a single wrapping page: the
 * executive dashboard, the month-by-month performance and
 * earnings, the investment portfolio, the monthly patrimony
 * and movements, the checking accounts, the fund reference,
 * the distributions, the per-index and per-asset-type
 * figures, the policy compliance, the accumulated indexes
 * and the monthly index table. Every page closes with a
 * running footer carrying the portfolio, the period and the
 * page number over the total. Conforms to **PDF/A-2b** so
 * the file is safe to archive.
 *
 * @explanation
 * Use this builder with `renderToBuffer` to produce the
 * report file in a server action or job.
 *
 * @param data - The report model to render.
 *
 * @returns The `<Document>` element.
 *
 * @example
 * renderToBuffer(BuildStatementReportDocument(DATA));
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function BuildStatementReportDocument(
  data: StatementReportData
): ReactElement<DocumentProps> {
  return (
    <Document
      title={`${data.portfolio.name} - ${data.periodLabel}`}
      author="Meta Investimentos"
      language="pt-BR"
      conformance="PDF/A-2b"
    >
      <Page
        size="A4"
        orientation="landscape"
        style={tw("bg-background p-8 pb-16 text-foreground")}
      >
        <StatementReportCoverSection data={data} />
        <RunningFooter data={data} />
      </Page>
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <RunningHeader data={data} />
        <DashboardSection data={data} />
      </Page>
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <PerformanceSection data={data} />
        <PositionsSection rows={data.positions} />
        <MonthlySection
          patrimony={data.patrimonyMonths}
          movements={data.movementMonths}
        />
        <AccountsSection
          rows={data.checkingAccounts}
          total={data.checkingAccountsTotal}
        />
        <FundsSection
          rows={data.fundAssets}
          totalAssets={data.kpis.totalPatrimony}
        />
        <DistributionsSection
          funds={data.fundDistribution}
          indexes={data.indexDistribution}
          institutions={data.institutionDistribution}
        />
        <IndexFiguresSection rows={data.indexFigures} />
        <AssetTypesSection rows={data.assetTypes} />
        <ComplianceSection rows={data.compliance} />
        <AccumulatedIndexesSection
          rows={data.accumulatedIndexes}
        />
        <IndexMonthsSection rows={data.indexMonths} />
        <ClosingNote />
        <RunningFooter data={data} />
      </Page>
    </Document>
  )
}
