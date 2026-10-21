import { Document, Page, Text, View } from "@react-pdf/renderer"
import type { DocumentProps } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import type { StatementReportData } from "@/services/statement/report/statement-report.types"

import { StatementReportCoverSection } from "./shared-statement-report-cover"
import { RunningHeader } from "./shared-statement-report-header"
import {
  ClosingNote,
  RunningFooter,
} from "./shared-statement-report-footer"
import { STATEMENT_REPORT_PAGE_TITLE_STYLE } from "./shared-statement-report-page-title.constants"
import { AccumulatedIndexesSection } from "./shared-statement-report-section-accumulated-indexes"
import { CheckingAccountsSection } from "./shared-statement-report-section-checking-accounts"
import { ComplianceSection } from "./shared-statement-report-section-compliance"
import { DashboardSection } from "./shared-statement-report-section-dashboard"
import { DistributionDonutsSection } from "./shared-statement-report-section-distribution-donuts"
import { DistributionFundsSection } from "./shared-statement-report-section-distribution-funds"
import { FundsSection } from "./shared-statement-report-section-funds"

import {
  CategoryBarsSection,
  IndexBarsSection,
} from "./shared-statement-report-section-figures-bars"
import { IndexMonthsSection } from "./shared-statement-report-section-index-months"
import { MovementSection } from "./shared-statement-report-section-movement"
import { PatrimonySection } from "./shared-statement-report-section-patrimony"
import { PerformanceSection } from "./shared-statement-report-section-performance"
import { PositionsSection } from "./shared-statement-report-section-positions"
import { Watermark } from "./shared-statement-report-watermark"
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
      {/* 1 - Cover */}
      <Page
        size="A4"
        orientation="landscape"
        style={tw("bg-background p-8 pb-16 text-foreground")}
      >
        <StatementReportCoverSection data={data} />
      </Page>
      {/* 2 - Main KPI's */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <DashboardSection data={data} />
        <RunningFooter data={data} />
      </Page>
      {/* 3 - Return and earnings */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Acompanhe a rentabilidade e a evolução mensal da sua
            carteira.
          </Text>
        </View>
        <PerformanceSection data={data} />
        <RunningFooter data={data} />
      </Page>
      {/* 4 - Positions */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Lista de fundos de investimentos.
          </Text>
        </View>
        <PositionsSection rows={data.positions} />
        <RunningFooter data={data} />
      </Page>
      {/* 5 - Checking accounts */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Visualize suas contas correntes.
          </Text>
        </View>
        <CheckingAccountsSection rows={data.checkingAccounts} />
        <RunningFooter data={data} />
      </Page>
      {/* 6 - Funds and norms */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Consulte o enquadramento dos seus fundos.
          </Text>
        </View>
        <FundsSection rows={data.fundAssets} />
        <RunningFooter data={data} />
      </Page>
      {/* 7 - Patrimony */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Evolução do patrimônio.
          </Text>
        </View>
        <PatrimonySection rows={data.patrimonyMonths} />
        <RunningFooter data={data} />
      </Page>
      {/* 8 - Cash flow history */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Histórico mensal de fluxo de caixa.
          </Text>
        </View>
        <MovementSection rows={data.movementMonths} />
        <RunningFooter data={data} />
      </Page>
      {/* 9 - Distributions by fund */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Distribuição da carteira por fundos.
          </Text>
        </View>
        <DistributionFundsSection rows={data.fundDistribution} />
        <RunningFooter data={data} />
      </Page>
      {/* 10 - Distributions by institution and index */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Distribuição da carteira por instituições e índices
            econômicos.
          </Text>
        </View>
        <DistributionDonutsSection
          indexes={data.indexDistribution}
          institutions={data.institutionDistribution}
        />
        <RunningFooter data={data} />
      </Page>
      {/* 11 - Patrimony and earnings by index */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Rendimento e patrimônio por índice de referência.
          </Text>
        </View>
        <IndexBarsSection rows={data.indexFigures} />
        <RunningFooter data={data} />
      </Page>
      {/* 12 - Patrimony and earnings by category */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Rendimento e patrimônio por categoria.
          </Text>
        </View>
        <CategoryBarsSection rows={data.assetTypes} />
        <RunningFooter data={data} />
      </Page>
      {/* 13 - Compliance verification */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Verificação de conformidade da carteira.
          </Text>
        </View>
        <ComplianceSection rows={data.compliance} />
        <RunningFooter data={data} />
      </Page>
      {/* 14 - Benchmark index per month */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Índices de referência por mês.
          </Text>
        </View>
        <IndexMonthsSection rows={data.indexMonths} />
        <RunningFooter data={data} />
      </Page>
      {/* 14 - Accumulated indexes */}
      <Page
        size="A4"
        orientation="landscape"
        wrap
        style={tw(
          "bg-background p-8 pb-16 pt-16 text-foreground"
        )}
      >
        <Watermark />
        <RunningHeader data={data} />
        <View style={tw("flex-col")}>
          <Text style={STATEMENT_REPORT_PAGE_TITLE_STYLE}>
            Índices acumulados.
          </Text>
        </View>
        <AccumulatedIndexesSection
          rows={data.accumulatedIndexes}
        />
        <ClosingNote />
        <RunningFooter data={data} />
      </Page>
    </Document>
  )
}
