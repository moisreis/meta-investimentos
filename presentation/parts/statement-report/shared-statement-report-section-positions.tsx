import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import {
  FormatCurrency,
  FormatSignedCurrency,
} from "@/presentation/presenters/currency.presenter"
import {
  FormatPercentage,
  FormatSignedPercentage,
  FormatUnsignedPercentage,
} from "@/presentation/presenters/percentage.presenter"
import type { StatementReportPositionRow } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"
import {
  ResultTone,
  ReturnTone,
  STATEMENT_REPORT_TONE,
} from "./shared-statement-report-tones.constants"
import {
  StatementReportTable,
  type StatementReportColumn,
} from "./shared-statement-report-table"

/**
 * The columns of the positions table.
 *
 * `% Fundo` is the share of the fund's total net assets the
 * position holds, the compliance ceiling of the report. It
 * stays a dash while the fund registry carries no net asset
 * figure, so the column never claims a share it cannot
 * resolve.
 */
const POSITION_COLUMNS: StatementReportColumn<StatementReportPositionRow>[] =
  [
    {
      label: STATEMENT_REPORT_COPY.fundColumn,
      flexBasis: "12%",
      render: (row) => (
        <Text style={tw("text-xs")}>{row.fundName}</Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.categoryColumn,
      flexBasis: "9%",
      render: (row) => (
        <Text style={tw("text-xs")}>
          {row.categoryName ??
            STATEMENT_REPORT_COPY.withoutCategoryLabel}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.articleColumn,
      flexBasis: "5%",
      render: (row) => (
        <Text style={tw("text-xs")}>
          {row.articleNumber ??
            STATEMENT_REPORT_COPY.unavailable}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.bankColumn,
      flexBasis: "9%",
      render: (row) => (
        <Text style={tw("text-xs text-subdued")}>
          {`${row.bankName} (${row.bankCode})`}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.weightColumn,
      flexBasis: "6%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatPercentage(row.weight)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.investedColumn,
      flexBasis: "10%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatCurrency(row.investedValue)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.earningsColumn,
      flexBasis: "8%",
      align: "right",
      render: (row) => (
        <Text
          style={tw(
            `text-xs text-right ${
              row.earnings === null
                ? STATEMENT_REPORT_TONE.neutral
                : STATEMENT_REPORT_TONE[ResultTone(row.earnings)]
            }`
          )}
        >
          {row.earnings === null
            ? STATEMENT_REPORT_COPY.unavailable
            : FormatCurrency(row.earnings)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.movementColumn,
      flexBasis: "8%",
      align: "right",
      render: (row) => (
        <Text
          style={tw(
            `text-xs text-right ${
              row.movement === null
                ? STATEMENT_REPORT_TONE.neutral
                : STATEMENT_REPORT_TONE[ResultTone(row.movement)]
            }`
          )}
        >
          {row.movement === null
            ? STATEMENT_REPORT_COPY.unavailable
            : FormatSignedCurrency(row.movement)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.finalValueColumn,
      flexBasis: "10%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatCurrency(row.finalValue)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.monthReturnColumn,
      flexBasis: "6%",
      align: "right",
      render: (row) => (
        <Text
          style={tw(
            `text-xs text-right ${
              row.returnMonthly === null
                ? STATEMENT_REPORT_TONE.neutral
                : ReturnTone(row.returnMonthly)
            }`
          )}
        >
          {FormatSignedPercentage(row.returnMonthly)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.yearReturnColumn,
      flexBasis: "6%",
      align: "right",
      render: (row) => (
        <Text
          style={tw(
            `text-xs text-right ${
              row.returnYearly === null
                ? STATEMENT_REPORT_TONE.neutral
                : ReturnTone(row.returnYearly)
            }`
          )}
        >
          {FormatSignedPercentage(row.returnYearly)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.last12mReturnColumn,
      flexBasis: "5%",
      align: "right",
      render: (row) => (
        <Text
          style={tw(
            `text-xs text-right ${
              row.returnLast12m === null
                ? STATEMENT_REPORT_TONE.neutral
                : ReturnTone(row.returnLast12m)
            }`
          )}
        >
          {FormatSignedPercentage(row.returnLast12m)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.fundShareColumn,
      flexBasis: "6%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {row.fundShare === null
            ? STATEMENT_REPORT_COPY.unavailable
            : FormatUnsignedPercentage(row.fundShare)}
        </Text>
      ),
    },
  ]

/**
 * @summary
 * Renders the investment portfolio table of the statement.
 *
 * @remarks
 * Lists the holdings with the fund, the category and the
 * norm article the fund is enquadred under, the custodian
 * bank, the money invested and the closing value, and the
 * month, year and trailing return of the position next to
 * the share of the fund it holds. The movement column stays
 * signed, so a redemption reads negative.
 *
 * @explanation
 * Use this component to render the `Carteira de
 * Investimentos` section of the statement document.
 *
 * @param rows - The position rows to render.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function PositionsSection(props: {
  rows: StatementReportPositionRow[]
}): ReactElement {
  const { rows: ROWS } = props

  return (
    <View style={tw("mt-8")}>
      <Text style={tw("text-base font-bold")}>
        {STATEMENT_REPORT_COPY.positionsTitle}
      </Text>
      <Text style={tw("text-xs text-subdued")}>
        {STATEMENT_REPORT_COPY.positionsSubtitle}
      </Text>
      {ROWS.length === 0 ? (
        <Text style={tw("mt-2 text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.positionsEmpty}
        </Text>
      ) : (
        <StatementReportTable
          columns={POSITION_COLUMNS}
          rows={ROWS}
        />
      )}
    </View>
  )
}
