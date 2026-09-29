/**
 * @summary
 * Checking account row rendered by the presentation layer.
 *
 * @remarks
 * Projects the checking account read model onto the fields
 * the screens actually render. Every money and quota
 * value stays a decimal string so the presenters are
 * the only place that formats it.
 *
 * @explanation
 * Use this type in tables, dialogs, forms and hooks.
 * The route loader maps the response DTO into it, so
 * no view file depends on the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface CheckingAccountRow {
  id: string
  bankAccountId: string
  date: string
  value: string
}
