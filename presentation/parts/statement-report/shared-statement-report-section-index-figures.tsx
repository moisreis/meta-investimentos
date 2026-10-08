import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatUnsignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { StatementReportIndexFigureRow } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"
import {
  ResultTone,
  STATEMENT_REPORT_TONE,
} from "./shared-statement-report-tones.constants"
import {
  StatementReportTable,
  type StatementReportColumn,
} from "./shared-statement-report-table"

// `IndexFigureRow` and `AssetTypeRow` share an identical
// shape in the report model, so one column set renders both.
type FigureRow = StatementReportIndexFigureRow

// Columns of a patrimony-and-earnings table.
const FIGURE_COLUMNS: StatementReportColumn<FigureRow>[] = [
  {
    label: STATEMENT_REPORT_COPY.indexColumn,
    flexBasis: "35%",
    render: (row) => (
      <View style={tw("flex-row items-center gap-1")}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            backgroundColor: row.color,
          }}
        />
        <Text style={tw("text-xs")}>{row.name}</Text>
      </View>
    ),
  },
  {
    label: STATEMENT_REPORT_COPY.patrimonyColumn,
    flexBasis: "25%",
    align: "right",
    render: (row) => (
      <Text style={tw("text-xs text-right")}>
        {FormatCurrency(row.patrimony)}
      </Text>
    ),
  },
  {
    label: STATEMENT_REPORT_COPY.earningsColumn,
    flexBasis: "22%",
    align: "right",
    render: (row) => (
      <Text
        style={tw(
          `text-xs text-right ${
            STATEMENT_REPORT_TONE[ResultTone(row.earnings)]
          }`
        )}
      >
        {FormatCurrency(row.earnings)}
      </Text>
    ),
  },
  {
    label: STATEMENT_REPORT_COPY.weightColumn,
    flexBasis: "18%",
    align: "right",
    render: (row) => (
      <Text style={tw("text-xs text-right")}>
        {FormatUnsignedPercentage(row.weight)}
      </Text>
    ),
  },
]

/**
 * @summary
 * Renders the patrimony and earnings per reference index.
 *
 * @remarks
 * Groups the funds of the portfolio by the index they are
 * measured against and shows the money and the result of the
 * month in each group, so the reader sees which index drives
 * the portfolio.
 *
 * @explanation
 * Use this component to render the `Rendimento e Patrimônio
 * por Índice` section of the statement document.
 *
 * @param rows - The index figure rows to render.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function IndexFiguresSection(props: {
  rows: StatementReportIndexFigureRow[]
}): ReactElement {
  return (
    <View style={tw("mt-8")}>
      <Text style={tw("text-base font-bold")}>
        {STATEMENT_REPORT_COPY.indexFiguresTitle}
      </Text>
      <StatementReportTable
        columns={FIGURE_COLUMNS}
        rows={props.rows}
      />
    </View>
  )
}

/**
 * @summary
 * Renders the patrimony and earnings per asset type.
 *
 * @remarks
 * Groups the funds by the category of the fund registry
 * (the asset type of the report) and shows the money and the
 * result of the month in each group.
 *
 * @explanation
 * Use this component to render the `Ativos e Rendimento por
 * Tipo de Ativo` section of the statement document.
 *
 * @param rows - The asset type rows to render.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function AssetTypesSection(props: {
  rows: StatementReportIndexFigureRow[]
}): ReactElement {
  return (
    <View style={tw("mt-8")}>
      <Text style={tw("text-base font-bold")}>
        {STATEMENT_REPORT_COPY.assetTypesTitle}
      </Text>
      <StatementReportTable
        columns={FIGURE_COLUMNS}
        rows={props.rows}
      />
    </View>
  )
}
