import { describe, expect, it } from "vitest";

import { AuditLog } from "@/business/entities/audit/audit-log.entity";

describe("AuditLog.create", () => {
  const VALID_PROPS = {
    entity: "User",
    entityId: "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    action: "CREATED",
  };

  it("creates a valid audit log with default values", () => {
    const AUDIT_LOG = AuditLog.create(VALID_PROPS);

    expect(AUDIT_LOG.id).toBeUndefined();
    expect(AUDIT_LOG.entity).toBe("User");
    expect(AUDIT_LOG.entityId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(AUDIT_LOG.action).toBe("CREATED");
    expect(AUDIT_LOG.changes).toBeNull();
    expect(AUDIT_LOG.userId).toBeNull();
    expect(AUDIT_LOG.createdAt).toBeInstanceOf(Date);
  });

  it("creates an audit log with the provided id", () => {
    const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

    const AUDIT_LOG = AuditLog.create(VALID_PROPS, ID);

    expect(AUDIT_LOG.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");

    const AUDIT_LOG = AuditLog.create({
      ...VALID_PROPS,
      changes: { field: "old" },
      userId: "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
      createdAt: CREATED_AT,
    });

    expect(AUDIT_LOG.changes).toEqual({ field: "old" });
    expect(AUDIT_LOG.userId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(AUDIT_LOG.createdAt).toBe(CREATED_AT);
  });

  it("throws when the entity is blank", () => {
    const { entity: _, ...REST } = VALID_PROPS;

    expect(() =>
      AuditLog.create(REST as Parameters<typeof AuditLog.create>[0]),
    ).toThrow("AuditLog must have an entity.");
  });

  it("throws when the entity id is blank", () => {
    const { entityId: _, ...REST } = VALID_PROPS;

    expect(() =>
      AuditLog.create(REST as Parameters<typeof AuditLog.create>[0]),
    ).toThrow("AuditLog must have an entity id.");
  });

  it("throws when the action is blank", () => {
    const { action: _, ...REST } = VALID_PROPS;

    expect(() =>
      AuditLog.create(REST as Parameters<typeof AuditLog.create>[0]),
    ).toThrow("AuditLog must have an action.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    AuditLog.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("AuditLog.equals", () => {
  const VALID_PROPS = {
    entity: "User",
    entityId: "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    action: "CREATED",
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const AUDIT_LOG = AuditLog.create(VALID_PROPS, ID);

    expect(AUDIT_LOG.equals(AUDIT_LOG)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = AuditLog.create(VALID_PROPS, ID);
    const B = AuditLog.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = AuditLog.create(VALID_PROPS, ID);
    const B = AuditLog.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = AuditLog.create(VALID_PROPS, ID);
    const B = AuditLog.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const AUDIT_LOG = AuditLog.create(VALID_PROPS, ID);

    expect(AUDIT_LOG.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const AUDIT_LOG = AuditLog.create(VALID_PROPS, ID);

    expect(AUDIT_LOG.equals(undefined)).toBe(false);
  });
});
