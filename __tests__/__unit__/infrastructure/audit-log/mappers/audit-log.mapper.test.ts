import { describe, it, expect } from "vitest"

import { AuditLog } from "@/domain/audit-log/entities/audit-log.entity"
import { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
} from "@/infrastructure/audit-log/mappers/audit-log.mapper"
import { buildAuditLog } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000039"
const ENTITY_ID = "00000000-0000-0000-0000-000000000015"
const USER_ID = "user-1"

describe("infrastructure/audit-log/mappers/audit-log.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to AuditLog entity", () => {
      const changes = { name: { from: "A", to: "B" } }
      const row = {
        id: ID,
        entity: "Portfolio",
        entityId: ENTITY_ID,
        action: "UPDATE",
        changes,
        userId: USER_ID,
        createdAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const auditLog = ToDomain(row)

      expect(auditLog.id).toBe(EntityId.create(ID))
      expect(auditLog.entity).toBe("Portfolio")
      expect(auditLog.entityId).toBe(EntityId.create(ENTITY_ID))
      expect(auditLog.action).toBe("UPDATE")
      expect(auditLog.changes).toEqual(changes)
      expect(auditLog.userId).toBe(EntityId.create(USER_ID))
      expect(auditLog.createdAt).toEqual(row.createdAt)
    })

    it("should map null optional columns to null", () => {
      const auditLog = ToDomain({
        id: ID,
        entity: "Portfolio",
        entityId: ENTITY_ID,
        action: "DELETE",
        changes: null,
        userId: null,
        createdAt: new Date("2026-01-15T12:00:00.000Z"),
      })

      expect(auditLog.changes).toBeNull()
      expect(auditLog.userId).toBeNull()
    })
  })

  describe("ToInsert", () => {
    it("should map AuditLog entity to insert object without id", () => {
      const auditLog = buildAuditLog({
        entityId: EntityId.create(ENTITY_ID),
        userId: EntityId.create(USER_ID),
        changes: { name: { from: "A", to: "B" } },
      })

      const insert = ToInsert(auditLog)

      expect(insert).not.toHaveProperty("id")
      expect(insert.entity).toBe("Portfolio")
      expect(insert.entityId).toBe(ENTITY_ID)
      expect(insert.action).toBe("UPDATE")
      expect(insert.changes).toEqual({
        name: { from: "A", to: "B" },
      })
      expect(insert.userId).toBe(USER_ID)
      expect(insert.createdAt).toEqual(auditLog.createdAt)
    })

    it("should map an absent userId to null", () => {
      const insert = ToInsert(buildAuditLog({ userId: null }))

      expect(insert.userId).toBeNull()
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const changes = {
        targetAllocation: { from: "12", to: "15" },
      }
      const original = AuditLog.create(
        {
          entity: "Position",
          entityId: EntityId.create(ENTITY_ID),
          action: "UPDATE",
          changes,
          userId: EntityId.create(USER_ID),
          createdAt: new Date("2026-01-15T12:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToInsert(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.changes).toEqual(changes)
      expect(restored.userId).toBe(EntityId.create(USER_ID))
    })

    it("should preserve the entity when optional columns are absent", () => {
      const original = AuditLog.create(
        {
          entity: "Portfolio",
          entityId: EntityId.create(ENTITY_ID),
          action: "CREATE",
          createdAt: new Date("2026-01-15T12:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToInsert(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.changes).toBeNull()
      expect(restored.userId).toBeNull()
    })
  })
})
