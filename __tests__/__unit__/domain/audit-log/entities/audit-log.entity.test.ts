import { describe, it, expect } from "vitest"

import { AuditLog } from "@/domain/audit-log/entities/audit-log.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildAuditLog } from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("audit-log-123")

describe("AuditLog", () => {
  describe("create", () => {
    it("should create a valid AuditLog with required props", () => {
      const auditLog = AuditLog.create({
        entity: "Portfolio",
        entityId: EntityId.create("portfolio-1"),
        action: "UPDATE",
      })

      expect(auditLog.entity).toBe("Portfolio")
      expect(auditLog.entityId).toBe(
        EntityId.create("portfolio-1")
      )
      expect(auditLog.action).toBe("UPDATE")
      expect(auditLog.changes).toBeNull()
      expect(auditLog.userId).toBeNull()
      expect(auditLog.id).toBeUndefined()
    })

    it("should create an AuditLog with provided id", () => {
      const auditLog = AuditLog.create(
        {
          entity: "Portfolio",
          entityId: EntityId.create("portfolio-1"),
          action: "UPDATE",
        },
        PERSISTED_ID
      )

      expect(auditLog.id).toBe(PERSISTED_ID)
    })

    it("should create an AuditLog with optional props", () => {
      const changes = { name: { from: "A", to: "B" } }

      const auditLog = AuditLog.create({
        entity: "Portfolio",
        entityId: EntityId.create("portfolio-1"),
        action: "UPDATE",
        changes,
        userId: EntityId.create("user-1"),
      })

      expect(auditLog.changes).toEqual(changes)
      expect(auditLog.userId).toBe(EntityId.create("user-1"))
    })

    it("should create an AuditLog with custom createdAt", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")

      const auditLog = AuditLog.create({
        entity: "Portfolio",
        entityId: EntityId.create("portfolio-1"),
        action: "UPDATE",
        createdAt,
      })

      expect(auditLog.createdAt).toEqual(createdAt)
    })

    it("should throw ValidationError when entity is blank", () => {
      expect(() =>
        AuditLog.create({
          entity: "   ",
          entityId: EntityId.create("portfolio-1"),
          action: "UPDATE",
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when entityId is blank", () => {
      expect(() =>
        AuditLog.create({
          entity: "Portfolio",
          entityId: EntityId.create("  "),
          action: "UPDATE",
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when action is blank", () => {
      expect(() =>
        AuditLog.create({
          entity: "Portfolio",
          entityId: EntityId.create("portfolio-1"),
          action: "",
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when required props are missing", () => {
      expect(() =>
        AuditLog.create(
          {} as Parameters<typeof AuditLog.create>[0]
        )
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const auditLog = buildAuditLog()

      expect(auditLog.equals(auditLog)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildAuditLog({ id: PERSISTED_ID })
      const second = buildAuditLog({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildAuditLog({
        id: EntityId.create("audit-1"),
      })
      const second = buildAuditLog({
        id: EntityId.create("audit-2"),
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildAuditLog()
      const second = buildAuditLog({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildAuditLog({ id: PERSISTED_ID })
      const second = buildAuditLog()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const auditLog = buildAuditLog()

      expect(auditLog.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const auditLog = buildAuditLog()

      expect(auditLog.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const auditLog = buildAuditLog()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        auditLog.action = "DELETE"
      }).toThrow(TypeError)
    })
  })
})
