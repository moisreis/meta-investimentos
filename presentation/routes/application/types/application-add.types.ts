/**
 * @summary
 * Fund offered by the add application form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface ApplicationFundOption {
  id: string
  name: string
  // Masked CNPJ rendered under the fund name. Absent when
  // the fund has no usable CNPJ, so the picker drops the
  // second line instead of showing a blank one.
  description?: string
}

/**
 * @summary
 * Portfolio offered by the add application form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface ApplicationPortfolioOption {
  id: string
  // Portfolio name rendered above the acronym.
  name: string
  // Portfolio acronym rendered under the name.
  description: string
}

// Options consumed by the add application form.
export interface ApplicationAddOptions {
  funds: ApplicationFundOption[]
  portfolios: ApplicationPortfolioOption[]
}

// Empty options used before the loader resolves.
export const EMPTY_APPLICATION_ADD_OPTIONS: ApplicationAddOptions =
  {
    funds: [],
    portfolios: [],
  }
