import { db } from "@/__tests__/__setup__/_database.setup";
import { AuditLogRepository } from "@/infrastructure/repositories";

/**
 * Re-exports the audit log seed fixtures and functions
 * used by audit log repository tests.
 */
export {
  AUDIT_LOG,
  OTHER_AUDIT_LOG,
  seedAuditLogs,
} from "@/__tests__/__seeds__/_audit-log.seed";

/**
 * Creates a new `AuditLogRepository` bound to the
 * shared test database.
 *
 * @returns A new `AuditLogRepository` instance.
 */
export function newAuditLogRepository(): AuditLogRepository {
  return new AuditLogRepository(db);
}
