/**
 * @summary
 * A holding of a portfolio, resolved down to its custodian.
 *
 * @remarks
 * Joins the four registries a distribution needs into one
 * flat record: the money a position holds, the fund that
 * position is invested in, the bank that custodies that
 * fund, and the index that fund is measured against.
 * Resolving the names in the loader is what lets the
 * chart builders stay pure — they group and format, and
 * never look a name up.
 *
 * A position can hold a negative balance when a redemption
 * took out more than the position had gained, so the
 * invested value stays a signed decimal string and the
 * presenters are the only place that formats it.
 *
 * @explanation
 * Use this type in the portfolio detail charts and hooks.
 * `BuildPortfolioHoldings` is the only producer, so the
 * registries behind it stay invisible to the view layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface PortfolioHolding {
  // Position the money is invested through.
  positionId: string
  // Fund the position holds.
  fundId: string
  // Fund name, rendered as the slice label of the position
  // distribution and as the title of the activity rows.
  fundName: string
  // Bank that custodies the fund. The fund schema requires
  // it, so a holding always resolves to a bank.
  bankId: string
  // Bank name, rendered as the slice label of the bank
  // distribution.
  bankName: string
  // Bank code, rendered under the bank name so two
  // institutions of the same group stay apart.
  bankCode: string
  // Index the fund is measured against, or `null` when the
  // fund tracks no index. It is the grouping key of the
  // benchmark distribution, so it stays nullable here rather
  // than being dropped: a fund without an index is a slice of
  // the portfolio, not an absence of one.
  benchmarkId: string | null
  // Name of that index, resolved from the registry. `null`
  // for a fund that tracks none, and for a fund whose index
  // is missing from the registry, so the chart can fall back
  // to a single untracked slice instead of a blank one.
  benchmarkName: string | null
  // Share of the portfolio the position holds (%).
  weight: string
  // Money currently invested in the position.
  investedValue: string
}
