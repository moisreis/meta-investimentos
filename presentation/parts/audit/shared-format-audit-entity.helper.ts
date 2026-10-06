import {
  AUDIT_ENTITIES,
  type AuditEntityToken,
} from "./shared-audit-entities.settings"

/**
 * @summary
 * Resolves the display label of an audited entity type.
 *
 * @remarks
 * Matches the entity token case-insensitively against the
 * known set and falls back to the raw recorded name when it
 * is unknown, so a row written by another deployment still
 * says what it audited rather than showing nothing.
 *
 * @explanation
 * Use this helper wherever an audit entity is rendered, so
 * the entity column of the audit log and the header
 * notification name the same record the same way.
 *
 * @param entity - The recorded audit entity token.
 *
 * @returns The display label of the entity.
 *
 * @example
 * const LABEL = FormatAuditEntity("Portfolio");
 * // returns "Carteira"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export function FormatAuditEntity(entity: string): string {
  const TOKEN = entity.trim().toUpperCase() as AuditEntityToken
  return AUDIT_ENTITIES[TOKEN] ?? (entity.trim() || entity)
}
