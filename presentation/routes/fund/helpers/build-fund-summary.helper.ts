import type { EntitySummary } from "@/presentation/parts/components/entity-detail-summary"
import { FormatCnpj } from "@/presentation/presenters/cnpj.presenter"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import { FormatText } from "@/presentation/presenters/text.presenter"

import { FUND_DETAIL } from "../settings/labels.settings"
import type { FundOverviewData } from "../types/fund-overview.types"

/**
 * @summary
 * Builds the registry profile of the fund detail screen.
 *
 * @remarks
 * Turns the resolved fund into the headline block the shared
 * detail summary renders: the registered name as the subject,
 * its CNPJ as the caption under it, and the registry the fund
 * links to as the ledger entries below. Every figure arrives
 * already formatted, so the block only decides where it sits.
 *
 * @explanation
 * Use this helper from the fund detail page. The shared
 * summary owns the markup, so the page composes it and never
 * repeats the ledger.
 *
 * @param data - The fund registry resolved by the loader.
 *
 * @returns The headline block of the fund detail screen.
 *
 * @example
 * const SUMMARY = BuildFundSummary(DATA);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export function BuildFundSummary(
  data: FundOverviewData
): EntitySummary {
  return {
    label: FUND_DETAIL.NAME_LABEL,
    value: data.fundName,
    caption: FormatCnpj(data.cnpj),
    note: null,
    entries: [
      {
        key: "bank",
        label: FUND_DETAIL.ENTRY_BANK,
        value: FormatText(data.bankName),
        tone: "neutral",
      },
      {
        key: "benchmark",
        label: FUND_DETAIL.ENTRY_BENCHMARK,
        value: FormatText(data.benchmarkName),
        tone: "neutral",
      },
      {
        key: "category",
        label: FUND_DETAIL.ENTRY_CATEGORY,
        value: FormatText(data.categoryName),
        tone: "neutral",
      },
      {
        key: "administrationFee",
        label: FUND_DETAIL.ENTRY_ADMINISTRATION_FEE,
        value: FormatPercentage(data.administrationFee),
        tone: "neutral",
      },
      {
        key: "performanceFee",
        label: FUND_DETAIL.ENTRY_PERFORMANCE_FEE,
        value: FormatPercentage(data.performanceFee),
        tone: "neutral",
      },
      {
        key: "positions",
        label: FUND_DETAIL.ENTRY_POSITIONS,
        value: FormatCount(data.positions.length),
        tone: "neutral",
      },
    ],
  }
}
