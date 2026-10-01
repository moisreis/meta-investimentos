/**
 * @summary
 * A position of the session user linked to the fund.
 *
 * @remarks
 * One row shape for the linked positions section of the
 * fund detail screen. The portfolio name is resolved by
 * the overview loader, so the datatable renders names and
 * never reaches into the service layer.
 *
 * @explanation
 * Use this type in the fund detail screen. The overview
 * loader is the only producer, so no view file depends on
 * the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export interface FundLinkedPositionRow {
  // Id of the linked position, used as the navigation
  // target of the row actions.
  id: string
  // Id of the portfolio holding the position.
  portfolioId: string
  // Portfolio name, rendered as the title of the row.
  portfolioName: string | null
  // Share of the portfolio the position represents (%).
  allocation: string
  // Balance the position opened with, as a decimal string.
  initialBalance: string | null
}

/**
 * @summary
 * Data resolved by the fund detail loader.
 *
 * @remarks
 * Carries the fund registry fields the profile block
 * renders, the names of the registries the fund links to
 * and the positions of the session user that hold the
 * fund.
 *
 * @explanation
 * Use this type as the payload of the fund detail screen.
 * The loader maps the registries and the positions onto
 * it, so no view file depends on the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export interface FundOverviewData {
  // Id of the resolved fund, empty while it cannot be
  // resolved.
  fundId: string
  // Registered fund name.
  fundName: string
  // Registered CNPJ.
  cnpj: string
  // Administration fee, null when unset.
  administrationFee: string | null
  // Performance fee, null when unset.
  performanceFee: string | null
  // Custodian bank name, null while it cannot be resolved.
  bankName: string | null
  // Benchmark name, null when unset or unresolved.
  benchmarkName: string | null
  // Category name, null when unset or unresolved.
  categoryName: string | null
  // Positions of the session user holding the fund.
  positions: FundLinkedPositionRow[]
}

// Neutral payload rendered while the loader returns null.
export const EMPTY_FUND_OVERVIEW: FundOverviewData = {
  fundId: "",
  fundName: "",
  cnpj: "",
  administrationFee: null,
  performanceFee: null,
  bankName: null,
  benchmarkName: null,
  categoryName: null,
  positions: [],
}
