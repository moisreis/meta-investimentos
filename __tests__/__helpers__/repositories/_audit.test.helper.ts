import { db } from "@/__tests__/__setup__/_database.setup";
import { AuditLogRepository } from "@/infrastructure/repositories";

export {
  AUDIT_LOG,
  OTHER_AUDIT_LOG,
  seedAuditLogs,
} from "@/__tests__/__seeds__/_audit-log.seed";

export function newAuditLogRepository(): AuditLogRepository {
  return new AuditLogRepository(db);
}
