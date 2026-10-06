import { Document, Page, Text, View } from "@react-pdf/renderer"
import type { DocumentProps } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import {
  FormatCurrency,
  FormatSignedCurrency,
} from "@/presentation/presenters/currency.presenter"
import {
  FormatDate,
  FormatDateTime,
} from "@/presentation/presenters/date.presenter"
import {
  FormatPercentage,
  FormatSignedPercentage,
} from "@/presentation/presenters/percentage.presenter"
import { FormatQuotaQuantity } from "@/presentation/presenters/quota-quantity.presenter"
import type {
  StatementReportData,
  StatementReportMovement,
  StatementReportMovementKind,
  StatementReportPositionRow,
} from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"

// Column widths of the positions table.
const POSITION_COLUMNS = {
  fund: { flexBasis: "42%" },
  bank: { flexBasis: "28%" },
  weight: { flexBasis: "12%" },
  invested: { flexBasis: "18%" },
}

// Column widths of the movements table.
const MOVEMENT_COLUMNS = {
  type: { flexBasis: "14%" },
  fund: { flexBasis: "38%" },
  date: { flexBasis: "18%" },
  amount: { flexBasis: "16%" },
  quotas: { flexBasis: "14%" },
}

// The text tone of a summary figure.
type SummaryTone = "neutral" | "positive" | "negative"

// The text class of each summary tone.
const SUMMARY_TONE: Record<SummaryTone, string> = {
  neutral: "text-foreground",
  positive: "text-positive",
  negative: "text-negative",
}

/**
 * @summary
 * Builds the PDF document of the monthly statement.
 *
 * @remarks
 * Renders an A4 landscape page mirroring the portfolio
 * detail screen: the portfolio masthead, the extrato
 * summary block (patrimony headline with the chained month
 * return and the reconciliation entries), the positions
 * datatable and the single movements datatable, newest
 * first. Every page closes with a running footer carrying
 * the portfolio, the period and the page number over the
 * total. Conforms to **PDF/A-2b** so the file is safe to
 * archive.
 *
 * @explanation
 * Use this builder with `renderToBuffer` to produce
 * the statement file in a server action or job.
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
 * @date 2026-09-30
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
        <Masthead data={data} />
        <SummarySection data={data} />
        <PositionsSection rows={data.positions} />
        <MovementsSection rows={data.movements} />
        <ClosingNote />
        <RunningFooter data={data} />
      </Page>
    </Document>
  )
}

/**
 * Renders the portfolio masthead of the report.
 */
function Masthead(props: {
  data: StatementReportData
}): ReactElement {
  const { data: DATA } = props

  return (
    <View style={tw("flex-row justify-between items-start")}>
      <View>
        <Text style={tw("text-2xl font-bold")}>
          {STATEMENT_REPORT_COPY.title}
        </Text>
        <Text style={tw("mt-1 text-base font-bold")}>
          {DATA.portfolio.name}
        </Text>
        <Text style={tw("text-xs text-subdued")}>
          {DATA.portfolio.acronym}
        </Text>
      </View>
      <View style={tw("bg-surface rounded px-3 py-2")}>
        <Text style={tw("text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.periodLabel}: {DATA.periodLabel}
        </Text>
        <Text style={tw("mt-1 text-xs font-bold")}>
          {`${FormatDate(DATA.periodStart)} - ${FormatDate(
            DATA.periodEnd
          )}`}
        </Text>
        <Text style={tw("mt-1 text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.issuedLabel}:{" "}
          {FormatDateTime(DATA.issuedAt)}
        </Text>
      </View>
    </View>
  )
}

/**
 * Renders the extrato summary block of the report.
 */
function SummarySection(props: {
  data: StatementReportData
}): ReactElement {
  const { summary: SUMMARY } = props.data

  const LABEL =
    SUMMARY.patrimonyClosingDate === null
      ? STATEMENT_REPORT_COPY.patrimonyLabel
      : `${STATEMENT_REPORT_COPY.patrimonyLabel} ${FormatDate(
          SUMMARY.patrimonyClosingDate
        )}`

  return (
    <View style={tw("mt-8")}>
      <Text style={tw("text-xs text-subdued")}>{LABEL}</Text>
      <Text style={tw("mt-2 text-3xl font-bold")}>
        {FormatCurrency(SUMMARY.patrimonyFinal)}
      </Text>
      {SUMMARY.monthlyReturn !== null && (
        <Text style={tw("mt-2 text-sm text-subdued")}>
          <Text
            style={tw(
              `font-bold ${ReturnTone(SUMMARY.monthlyReturn)}`
            )}
          >
            {FormatSignedPercentage(SUMMARY.monthlyReturn)}
          </Text>{" "}
          {STATEMENT_REPORT_COPY.returnNote}
        </Text>
      )}
      <View
        style={tw(
          "mt-5 flex-row gap-4 border-t border-border pt-4"
        )}
      >
        <SummaryEntry
          label={STATEMENT_REPORT_COPY.openingEntryLabel}
          value={FormatCurrency(SUMMARY.patrimonyOpening)}
        />
        <SummaryEntry
          label={STATEMENT_REPORT_COPY.applicationsEntryLabel}
          value={FormatCurrency(SUMMARY.applicationsTotal)}
        />
        <SummaryEntry
          label={STATEMENT_REPORT_COPY.withdrawalsEntryLabel}
          value={FormatCurrency(SUMMARY.withdrawalsTotal)}
        />
        <SummaryEntry
          label={STATEMENT_REPORT_COPY.resultEntryLabel}
          value={FormatSignedCurrency(SUMMARY.result)}
          tone={ResultTone(SUMMARY.result)}
        />
      </View>
    </View>
  )
}

/**
 * Renders one reconciliation entry of the summary block.
 */
function SummaryEntry(props: {
  label: string
  value: string
  tone?: SummaryTone
}): ReactElement {
  return (
    <View style={tw("flex-1")}>
      <Text style={tw("text-xs text-subdued")}>
        {props.label}
      </Text>
      <Text
        style={tw(
          `mt-1 text-base font-bold ${
            SUMMARY_TONE[props.tone ?? "neutral"]
          }`
        )}
      >
        {props.value}
      </Text>
    </View>
  )
}

/**
 * Picks the tone of the month result figure.
 */
function ResultTone(value: string): SummaryTone {
  const AMOUNT = Number.parseFloat(value)
  if (AMOUNT > 0) return "positive"
  if (AMOUNT < 0) return "negative"
  return "neutral"
}

/**
 * Picks the text tone of the monthly return.
 */
function ReturnTone(value: string): string {
  return Number.parseFloat(value) < 0
    ? "text-negative"
    : "text-positive"
}

/**
 * Picks the text tone of a movement direction.
 */
function KindTone(kind: StatementReportMovementKind): string {
  return kind === "application"
    ? "text-positive"
    : "text-negative"
}

/**
 * Renders the positions table of the report.
 */
function PositionsSection(props: {
  rows: StatementReportPositionRow[]
}): ReactElement {
  const { rows: ROWS } = props

  return (
    <View style={tw("mt-8")}>
      <Text style={tw("text-base font-bold")}>
        {STATEMENT_REPORT_COPY.positionsTitle}
      </Text>
      {ROWS.length === 0 ? (
        <Text style={tw("mt-2 text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.positionsEmpty}
        </Text>
      ) : (
        <View style={tw("mt-3")}>
          <View
            fixed
            style={tw("flex-row bg-surface px-2 py-1")}
          >
            <Text
              style={[
                tw("text-xs font-bold text-subdued"),
                POSITION_COLUMNS.fund,
              ]}
            >
              {STATEMENT_REPORT_COPY.fundColumn}
            </Text>
            <Text
              style={[
                tw("text-xs font-bold text-subdued"),
                POSITION_COLUMNS.bank,
              ]}
            >
              {STATEMENT_REPORT_COPY.bankColumn}
            </Text>
            <Text
              style={[
                tw("text-xs font-bold text-subdued text-right"),
                POSITION_COLUMNS.weight,
              ]}
            >
              {STATEMENT_REPORT_COPY.weightColumn}
            </Text>
            <Text
              style={[
                tw("text-xs font-bold text-subdued text-right"),
                POSITION_COLUMNS.invested,
              ]}
            >
              {STATEMENT_REPORT_COPY.investedColumn}
            </Text>
          </View>
          {ROWS.map((position, index) => (
            <View
              key={index}
              style={tw(
                "flex-row border-b border-border px-2 py-1"
              )}
            >
              <Text
                style={[tw("text-xs"), POSITION_COLUMNS.fund]}
              >
                {position.fundName}
              </Text>
              <Text
                style={[
                  tw("text-xs text-subdued"),
                  POSITION_COLUMNS.bank,
                ]}
              >
                {`${position.bankName} (${position.bankCode})`}
              </Text>
              <Text
                style={[
                  tw("text-xs text-right"),
                  POSITION_COLUMNS.weight,
                ]}
              >
                {FormatPercentage(position.weight)}
              </Text>
              <Text
                style={[
                  tw("text-xs text-right"),
                  POSITION_COLUMNS.invested,
                ]}
              >
                {FormatCurrency(position.investedValue)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

/**
 * Renders the monthly movements table of the report.
 */
function MovementsSection(props: {
  rows: StatementReportMovement[]
}): ReactElement {
  const { rows: ROWS } = props

  return (
    <View style={tw("mt-8")}>
      <Text style={tw("text-base font-bold")}>
        {STATEMENT_REPORT_COPY.movementsTitle}
      </Text>
      {ROWS.length === 0 ? (
        <Text style={tw("mt-2 text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.movementsEmpty}
        </Text>
      ) : (
        <View style={tw("mt-3")}>
          <View
            fixed
            style={tw("flex-row bg-surface px-2 py-1")}
          >
            <Text
              style={[
                tw("text-xs font-bold text-subdued"),
                MOVEMENT_COLUMNS.type,
              ]}
            >
              {STATEMENT_REPORT_COPY.typeColumn}
            </Text>
            <Text
              style={[
                tw("text-xs font-bold text-subdued"),
                MOVEMENT_COLUMNS.fund,
              ]}
            >
              {STATEMENT_REPORT_COPY.fundColumn}
            </Text>
            <Text
              style={[
                tw("text-xs font-bold text-subdued"),
                MOVEMENT_COLUMNS.date,
              ]}
            >
              {STATEMENT_REPORT_COPY.dateColumn}
            </Text>
            <Text
              style={[
                tw("text-xs font-bold text-subdued text-right"),
                MOVEMENT_COLUMNS.amount,
              ]}
            >
              {STATEMENT_REPORT_COPY.amountColumn}
            </Text>
            <Text
              style={[
                tw("text-xs font-bold text-subdued text-right"),
                MOVEMENT_COLUMNS.quotas,
              ]}
            >
              {STATEMENT_REPORT_COPY.quotasColumn}
            </Text>
          </View>
          {ROWS.map((movement, index) => (
            <View
              key={index}
              style={tw(
                "flex-row border-b border-border px-2 py-1"
              )}
            >
              <Text
                style={[
                  tw(
                    `text-xs font-bold ${KindTone(movement.kind)}`
                  ),
                  MOVEMENT_COLUMNS.type,
                ]}
              >
                {movement.kind === "application"
                  ? STATEMENT_REPORT_COPY.typeApplication
                  : STATEMENT_REPORT_COPY.typeWithdrawal}
              </Text>
              <View
                style={[tw("flex-col"), MOVEMENT_COLUMNS.fund]}
              >
                <Text style={tw("text-xs")}>
                  {movement.fundName}
                </Text>
                <Text style={tw("text-xs text-subdued")}>
                  {movement.bankName}
                </Text>
              </View>
              <Text
                style={[tw("text-xs"), MOVEMENT_COLUMNS.date]}
              >
                {FormatDate(movement.date)}
              </Text>
              <Text
                style={[
                  tw("text-xs text-right"),
                  MOVEMENT_COLUMNS.amount,
                ]}
              >
                {FormatCurrency(movement.amount)}
              </Text>
              <Text
                style={[
                  tw("text-xs text-right"),
                  MOVEMENT_COLUMNS.quotas,
                ]}
              >
                {FormatQuotaQuantity(movement.quotas)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

/**
 * Marks the end of the statement body.
 */
function ClosingNote(): ReactElement {
  return (
    <Text style={tw("mt-8 text-center text-xs text-subdued")}>
      {STATEMENT_REPORT_COPY.footer}
    </Text>
  )
}

/**
 * Builds the "Página X de Y" label of the running footer.
 */
function FormatPageLabel(
  pageNumber: number,
  totalPages: number
): string {
  return `${STATEMENT_REPORT_COPY.pagePrefix} ${pageNumber} ${STATEMENT_REPORT_COPY.pageSeparator} ${totalPages}`
}

/**
 * Renders the running footer stamped on every page.
 *
 * @remarks
 * Stays pinned to the bottom margin so a printed or archived
 * page is never anonymous: it carries the portfolio, the
 * period and the page number against the total, which
 * **react-pdf** resolves in a second pass once the page
 * count is known.
 */
function RunningFooter(props: {
  data: StatementReportData
}): ReactElement {
  const { data: DATA } = props

  return (
    <View
      fixed
      style={tw(
        "absolute left-8 right-8 bottom-8 flex-row justify-between items-center border-t border-border pt-2"
      )}
    >
      <Text style={tw("text-xs text-subdued")}>
        {`${DATA.portfolio.name} - ${DATA.periodLabel}`}
      </Text>
      <Text
        style={tw("text-xs text-subdued")}
        render={({ pageNumber, totalPages }) => (
          <Text style={tw("text-xs text-subdued")}>
            {FormatPageLabel(pageNumber, totalPages)}
          </Text>
        )}
      />
    </View>
  )
}
