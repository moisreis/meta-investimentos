/**
 * @summary
 * A bank account of a portfolio, resolved down to the bank
 * that hosts it.
 *
 * @remarks
 * Joins the bank account and bank registries into one flat
 * record: the account itself plus the institution name and
 * code that label it. Resolving the names in the loader is
 * what lets the checking chart builders stay pure — they
 * group and format, and never look a name up.
 *
 * @explanation
 * Use this type in the portfolio detail charts and hook.
 * `BuildPortfolioBankAccountViews` is the only producer, so
 * the registries behind it stay invisible to the view layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface PortfolioBankAccountView {
  // Bank account the balances are recorded against.
  id: string
  // Bank that hosts the account. The bank account schema
  // requires it, so an account always resolves to a bank.
  bankId: string
  // Bank name, rendered in the distribution slice label.
  bankName: string
  // Bank code, rendered next to the name so two institutions
  // of the same group stay apart.
  bankCode: string
  // Agency of the account, rendered in the slice label.
  agency: string
  // Account number of the account, rendered in the slice
  // label.
  accountNumber: string
}
