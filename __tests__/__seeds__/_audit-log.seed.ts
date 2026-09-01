import { db } from "@/__tests__/__setup__/_database.setup";
import { AuditLog } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { AuditLogRepository } from "@/infrastructure/repositories";
import { OTHER_USER_ID, seedUserById, USER_ID } from "./_user.seed";

export const AUDIT_LOG = AuditLog.create(
  {
    entity: "user",
    entityId: EntityId.create(USER_ID),
    action: "update",
    changes: { name: { from: "José", to: "José da Silva Junior" } },
    userId: EntityId.create(USER_ID),
  },
  "52a9b0c1-4d5e-4f6a-8b7c-9d0e1f2a3b4c",
);

export const OTHER_AUDIT_LOG = AuditLog.create(
  {
    entity: "portfolio",
    entityId: EntityId.create("fa0a1b2c-3d4e-4f5a-9b6c-7d8e9f0a1b2c"),
    action: "create",
    changes: null,
    userId: EntityId.create(OTHER_USER_ID),
  },
  "63b0c1d2-5e6f-4a7b-9c8d-0e1f2a3b4c5d",
);

export async function seedAuditLogs(): Promise<AuditLog[]> {
  await seedUserById(USER_ID);
  await seedUserById(OTHER_USER_ID);

  const REPOSITORY = new AuditLogRepository(db);

  return [
    await REPOSITORY.save(AUDIT_LOG),
    await REPOSITORY.save(OTHER_AUDIT_LOG),
  ];
}
