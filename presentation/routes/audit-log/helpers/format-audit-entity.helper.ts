// Human-friendly labels for the audited entity names.
const AUDIT_ENTITY_LABELS: Record<string, string> = {
  USER: "Usuário",
  PORTFOLIO: "Carteira",
  POSITION: "Posição",
  APPLICATION: "Aplicação",
  WITHDRAWAL: "Resgate",
  TRANSACTION: "Transação",
  STATEMENT: "Relatório",
  BANK: "Banco",
  BANKACCOUNT: "Conta bancária",
  CHECKINGACCOUNT: "Conta corrente",
  FUND: "Fundo",
  BENCHMARKHISTORY: "Histórico de registro",
}

/**
 * @summary
 * Resolves the display label of an audited entity name.
 *
 * @remarks
 * Matches the entity name case-insensitively against a
 * known set and falls back to the raw name when unknown.
 *
 * @explanation
 * Use this helper in the datatable cells so the entity
 * column reads in Brazilian Portuguese while still
 * showing unknown names as recorded.
 *
 * @param entity - The audited entity name.
 *
 * @returns The display label.
 *
 * @example
 * const LABEL = FormatAuditEntity("Portfolio");
 * // returns "Carteira"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function FormatAuditEntity(entity: string): string {
  const KEY = entity.replace(/\s+/g, "").toUpperCase()

  return AUDIT_ENTITY_LABELS[KEY] ?? entity
}
