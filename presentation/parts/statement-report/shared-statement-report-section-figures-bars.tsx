import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import {
  FormatCurrency,
  FormatSignedCurrency,
} from "@/presentation/presenters/currency.presenter"
import type {
  StatementReportAssetTypeRow,
  StatementReportIndexFigureRow,
} from "@/services/statement/report/statement-report.types"

import {
  StatementReportHorizontalBars,
  type StatementReportBarRow,
} from "./shared-statement-report-charts"
import { STATEMENT_REPORT_SECTION_TITLE_STYLE } from "./shared-statement-report-section-title.constants"
import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"

// `IndexFigureRow` and `AssetTypeRow` share an identical
// shape in the report model, so one renderer draws both.
type FigureRow = StatementReportIndexFigureRow

/**
 * @summary
 * Renders the earnings and the patrimony per reference index.
 *
 * @remarks
 * Splits the index figures into two bar lists, one for the
 * earnings and one for the patrimony, so the reader compares
 * how each reference index drives the result and the money
 * of the portfolio.
 *
 * @explanation
 * Use this component to render the `Rendimento e Patrimônio
 * por Índice` charts of the statement document.
 *
 * @param rows - The patrimony and earnings per index.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
export function IndexBarsSection(props: {
  rows: StatementReportIndexFigureRow[]
}): ReactElement {
  return (
    <FiguresBars
      rows={props.rows}
      earningsTitle={
        STATEMENT_REPORT_COPY.indexEarningsBarsTitle
      }
      patrimonyTitle={
        STATEMENT_REPORT_COPY.indexPatrimonyBarsTitle
      }
    />
  )
}

/**
 * @summary
 * Renders the earnings and the patrimony per category.
 *
 * @remarks
 * Splits the asset-type figures, which group the funds by
 * the category of the fund registry, into two bar lists, one
 * for the earnings and one for the patrimony, so the reader
 * compares how each category drives the result and the money
 * of the portfolio.
 *
 * @explanation
 * Use this component to render the `Rendimento e Patrimônio
 * por Categoria` charts of the statement document.
 *
 * @param rows - The patrimony and earnings per category.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
export function CategoryBarsSection(props: {
  rows: StatementReportAssetTypeRow[]
}): ReactElement {
  return (
    <FiguresBars
      rows={props.rows}
      earningsTitle={
        STATEMENT_REPORT_COPY.categoryEarningsBarsTitle
      }
      patrimonyTitle={
        STATEMENT_REPORT_COPY.categoryPatrimonyBarsTitle
      }
    />
  )
}

/**
 * @summary
 * Renders the earnings and the patrimony of a group of funds
 * as two horizontal bar lists.
 *
 * @remarks
 * Splits one set of figure rows into two bar lists, one for
 * the earnings and one for the patrimony. Both lists keep the
 * order and the color of the source rows, so a group sits on
 * the same tone in the two charts. The earnings keep their
 * sign in the reading, because a losing group is a real
 * figure.
 *
 * @explanation
 * Shared by the index and the category bars sections, which
 * differ only in the source rows and the titles.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
function FiguresBars(props: {
  rows: FigureRow[]
  earningsTitle: string
  patrimonyTitle: string
}): ReactElement {
  const EARNINGS: StatementReportBarRow[] = props.rows.map(
    (row) => ({
      label: row.name,
      value: ToNumber(row.earnings),
      color: row.color,
      display: FormatSignedCurrency(row.earnings),
    })
  )
  const PATRIMONY: StatementReportBarRow[] = props.rows.map(
    (row) => ({
      label: row.name,
      value: ToNumber(row.patrimony),
      color: row.color,
      display: FormatCurrency(row.patrimony),
    })
  )

  return (
    <View style={tw("mt-8 flex-col gap-8")}>
      <FiguresBarsBlock
        title={props.earningsTitle}
        rows={EARNINGS}
      />
      <View style={tw("border-t border-border")} />
      <FiguresBarsBlock
        title={props.patrimonyTitle}
        rows={PATRIMONY}
      />
    </View>
  )
}

/**
 * Renders one titled block of horizontal bars.
 */
function FiguresBarsBlock(props: {
  title: string
  rows: StatementReportBarRow[]
}): ReactElement {
  return (
    <View>
      <Text style={STATEMENT_REPORT_SECTION_TITLE_STYLE}>
        {props.title}
      </Text>
      <View style={tw("mt-2")}>
        <StatementReportHorizontalBars rows={props.rows} />
      </View>
    </View>
  )
}

/**
 * Parses a figure into a chart number. A negative earnings
 * stays negative so the bar keeps its magnitude while the
 * display carries the sign.
 */
function ToNumber(value: string): number {
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : 0
}
