import { PRESENTER_FALLBACK } from "../constants/presenter.constants"

export { PRESENTER_FALLBACK }

/**
 * @summary
 * Formats a fund display string (name + CNPJ).
 *
 * @remarks
 * Combines the fund name and masked CNPJ for display.
 * Returns the fallback when the lookup is nil.
 *
 * @explanation
 * Use this function to render fund lookup data in tables.
 * It combines the fund name and formatted CNPJ into a
 * single formatted string suitable for table cells.
 *
 * @param lookup - The fund lookup data or null.
 * @returns Formatted fund display string or fallback.
 *
 * @example
 * const DISPLAY = FormatFundLookup({
 *   fundName: "Fundo Exemplo",
 *   fundCnpj: "12345678000199"
 * });
 * // returns "Fundo Exemplo (12.345.678/0001-99)"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export function FormatFundLookup(
  lookup:
    { fundName?: string; fundCnpj?: string } | null | undefined
): string {
  if (!lookup || !lookup.fundName) {
    return PRESENTER_FALLBACK
  }

  const NAME = lookup.fundName.trim()

  if (lookup.fundCnpj) {
    const CNPJ = String(lookup.fundCnpj).replace(/\D/g, "")
    if (CNPJ.length === 14) {
      const CNPJ_FORMATTED =
        CNPJ.slice(0, 2) +
        "." +
        CNPJ.slice(2, 5) +
        "." +
        CNPJ.slice(5, 8) +
        "/" +
        CNPJ.slice(8, 12) +
        "-" +
        CNPJ.slice(12, 14)
      return `${NAME} (${CNPJ_FORMATTED})`
    }
  }

  return NAME
}

/**
 * @summary
 * Formats a portfolio display string (name + acronym).
 *
 * @remarks
 * Combines the portfolio name and acronym for display.
 * Returns the fallback when the lookup is nil.
 *
 * @explanation
 * Use this function to render portfolio lookup data in tables.
 *
 * @param lookup - The portfolio lookup data or null.
 * @returns Formatted portfolio display string or fallback.
 *
 * @example
 * const DISPLAY = FormatPortfolioLookup({
 *   portfolioName: "Minha Carteira",
 *   portfolioAcronym: "MC"
 * });
 * // returns "Minha Carteira (MC)"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export function FormatPortfolioLookup(
  lookup:
    | { portfolioName?: string; portfolioAcronym?: string }
    | null
    | undefined
): string {
  if (!lookup || !lookup.portfolioName) {
    return PRESENTER_FALLBACK
  }

  const NAME = lookup.portfolioName.trim()

  if (lookup.portfolioAcronym) {
    return `${NAME} (${lookup.portfolioAcronym.trim()})`
  }

  return NAME
}

/**
 * @summary
 * Formats a bank display string (name + code).
 *
 * @remarks
 * Combines the bank name and code for display.
 * Returns the fallback when the lookup is nil.
 *
 * @explanation
 * Use this function to render bank lookup data in tables.
 *
 * @param lookup - The bank lookup data or null.
 * @returns Formatted bank display string or fallback.
 *
 * @example
 * const DISPLAY = FormatBankLookup({
 *   bankName: "Banco do Brasil",
 *   bankCode: "001"
 * });
 * // returns "Banco do Brasil (001)"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export function FormatBankLookup(
  lookup:
    { bankName?: string; bankCode?: string } | null | undefined
): string {
  if (!lookup || !lookup.bankName) {
    return PRESENTER_FALLBACK
  }

  const NAME = lookup.bankName.trim()

  if (lookup.bankCode) {
    return `${NAME} (${lookup.bankCode.trim()})`
  }

  return NAME
}

/**
 * @summary
 * Formats a bank account display string (agency + account).
 *
 * @remarks
 * Combines the agency and account number for display.
 * Returns the fallback when the lookup is nil.
 *
 * @explanation
 * Use this function to render bank account lookup data in tables.
 *
 * @param lookup - The bank account lookup data or null.
 * @returns Formatted bank account display string or fallback.
 *
 * @example
 * const DISPLAY = FormatBankAccountLookup({
 *   agency: "1234",
 *   accountNumber: "56789-0"
 * });
 * // returns "Ag. 1234 Cta. 56789-0"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export function FormatBankAccountLookup(
  lookup:
    | { agency?: string; accountNumber?: string }
    | null
    | undefined
): string {
  if (!lookup) {
    return PRESENTER_FALLBACK
  }

  const AGENCY = lookup.agency?.trim() ?? ""
  const ACCOUNT = lookup.accountNumber?.trim() ?? ""

  if (!AGENCY && !ACCOUNT) {
    return PRESENTER_FALLBACK
  }

  if (AGENCY && ACCOUNT) {
    return `Ag. ${AGENCY} Cta. ${ACCOUNT}`
  }

  if (AGENCY) {
    return `Ag. ${AGENCY}`
  }

  return `Cta. ${ACCOUNT}`
}

/**
 * @summary
 * Formats an entity display string (name + optional sub-label).
 *
 * @remarks
 * Generic formatter for entity lookups with a main name
 * and optional sub-label. Returns the fallback when nil.
 *
 * @explanation
 * Use this function for generic entity lookups in tables.
 *
 * @param name - The main display name.
 * @param subLabel - Optional sub-label (acronym, code, CNPJ, etc.).
 * @returns Formatted entity display string or fallback.
 *
 * @example
 * const DISPLAY = FormatEntityLookup("Fundo Exemplo", "12.345.678/0001-99");
 * // returns "Fundo Exemplo (12.345.678/0001-99)"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export function FormatEntityLookup(
  name: string | null | undefined,
  subLabel?: string | null | undefined
): string {
  if (!name || name.trim() === "") {
    return PRESENTER_FALLBACK
  }

  const NAME = name.trim()

  if (subLabel && subLabel.trim() !== "") {
    return `${NAME} (${subLabel.trim()})`
  }

  return NAME
}

/**
 * @summary
 * Formats a position display string (fund name + portfolio name/acronym).
 *
 * @remarks
 * Combines the fund name and portfolio identifier for display.
 * Returns the fallback when the lookup is nil.
 *
 * @explanation
 * Use this function to render position lookup data in tables.
 *
 * @param lookup - The position lookup data or null.
 * @returns Formatted position display string or fallback.
 *
 * @example
 * const DISPLAY = FormatPositionLookup({
 *   fundName: "Fundo Exemplo",
 *   portfolioName: "Minha Carteira",
 *   portfolioAcronym: "MC"
 * });
 * // returns "Fundo Exemplo (Minha Carteira - MC)"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export function FormatPositionLookup(
  lookup:
    | {
        fundName?: string
        portfolioName?: string
        portfolioAcronym?: string
      }
    | null
    | undefined
): string {
  if (!lookup || !lookup.fundName) {
    return PRESENTER_FALLBACK
  }

  const FUND_NAME = lookup.fundName.trim()

  const PORTFOLIO = lookup.portfolioName?.trim() ?? ""
  const ACRONYM = lookup.portfolioAcronym?.trim() ?? ""

  let PORTFOLIO_LABEL = PORTFOLIO
  if (ACRONYM && ACRONYM !== PORTFOLIO) {
    PORTFOLIO_LABEL = `${PORTFOLIO} (${ACRONYM})`
  } else {
    PORTFOLIO_LABEL = PORTFOLIO
  }

  if (PORTFOLIO_LABEL) {
    return `${FUND_NAME} (${PORTFOLIO_LABEL})`
  }

  return FUND_NAME
}
