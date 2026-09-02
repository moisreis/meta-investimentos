import {
  AUDIT_LOG,
  AUDIT_LOG_ID,
  OTHER_AUDIT_LOG,
  OTHER_AUDIT_LOG_ID,
  OTHER_USER_ID,
  USER_ID,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { AuditLog } from "@/business/entities";
import { AuditLogRepository } from "@/infrastructure/repositories";
import { seedUserById } from "./_user.seed";

export { AUDIT_LOG, OTHER_AUDIT_LOG, AUDIT_LOG_ID, OTHER_AUDIT_LOG_ID };

export async function seedAuditLogs(): Promise<AuditLog[]> {
  await seedUserById(USER_ID);
  await seedUserById(OTHER_USER_ID);

  const REPOSITORY = new AuditLogRepository(db);

  return [
    await REPOSITORY.save(AUDIT_LOG),
    await REPOSITORY.save(OTHER_AUDIT_LOG),
  ];
}
