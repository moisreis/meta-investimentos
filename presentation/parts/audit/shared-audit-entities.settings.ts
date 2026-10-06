/**
 * @summary
 * The audited entity types, and how each one reads.
 *
 * @remarks
 * A server action names one of these tokens for the record it
 * touched. The key is the uppercased form of what is stored
 * in the `entity` column, and the value is the Brazilian
 * Portuguese word the product shows for it. The audit log
 * screen and the header notification both resolve the token
 * through this table, so an entry is worded the same way
 * wherever it is read.
 *
 * @explanation
 * Add a token here when the product starts auditing a new
 * kind of record. A token nobody has heard of still renders,
 * falling back to the raw recorded value, so a row written
 * by another deployment stays legible.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export const AUDIT_ENTITIES = {
  APPLICATION: "Aplicação",
  BANK: "Banco",
  BANKACCOUNT: "Conta bancária",
  BENCHMARK: "Índice",
  BENCHMARKHISTORY: "Histórico de índice",
  CATEGORY: "Categoria",
  CHECKINGACCOUNT: "Conta corrente",
  FUND: "Fundo",
  NORM: "Norma",
  PORTFOLIO: "Carteira",
  PORTFOLIOPERFORMANCE: "Performance da carteira",
  POSITION: "Posição",
  POSITIONPERFORMANCE: "Performance da posição",
  QUOTA: "Cota",
  STATEMENT: "Relatório",
  TRANSACTION: "Transação",
  USER: "Usuário",
  WITHDRAWAL: "Resgate",
} as const

// Token of a recorded audit entity.
export type AuditEntityToken = keyof typeof AUDIT_ENTITIES

/**
 * @summary
 * The canonical way each entity token is stored in the
 * `entity` column and handed to the notification.
 *
 * @remarks
 * The token keys above are all capitals; the stored value is
 * the human casing this table maps them to, so a bank row is
 * recorded as `Bank`, exactly as legacy rows already are.
 * Renderers match case-insensitively, but grouping on the raw
 * value (as the audit KPIs do) needs one casing for every
 * row, and this is the casing that guarantees it.
 *
 * @explanation
 * Add the matching name here when an entity gains a token
 * above, so an action that names it cannot misspell it.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export const AUDIT_ENTITY_NAMES = {
  APPLICATION: "Application",
  BANK: "Bank",
  BANKACCOUNT: "BankAccount",
  BENCHMARK: "Benchmark",
  BENCHMARKHISTORY: "BenchmarkHistory",
  CATEGORY: "Category",
  CHECKINGACCOUNT: "CheckingAccount",
  FUND: "Fund",
  NORM: "Norm",
  PORTFOLIO: "Portfolio",
  PORTFOLIOPERFORMANCE: "PortfolioPerformance",
  POSITION: "Position",
  POSITIONPERFORMANCE: "PositionPerformance",
  QUOTA: "Quota",
  STATEMENT: "Statement",
  TRANSACTION: "Transaction",
  USER: "User",
  WITHDRAWAL: "Withdrawal",
} as const

// Canonical stored spelling of an audited entity type.
export type AuditEntityName =
  (typeof AUDIT_ENTITY_NAMES)[keyof typeof AUDIT_ENTITY_NAMES]
