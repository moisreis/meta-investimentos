import { describe, it, expect } from "vitest"

import {
  buildAuditLog,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"
import { toResponseDTO } from "@/services/audit-log/mappers/audit-log.mapper"

const ID = "00000000-0000-0000-0000-000000000020"

describe("services/audit-log/mappers/audit-log.mapper", () => {
  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing an audit log", () => {
      const auditLog = buildAuditLog({ id: buildEntityId(ID) })

      const response = toResponseDTO(auditLog)

      expect(response.id).toBe(ID)
    })

    it("should carry the audited entity name and id when serializing an audit log", () => {
      const auditLog = buildAuditLog({
        entity: "Portfolio",
        entityId: buildEntityId("portfolio-77"),
      })

      const response = toResponseDTO(auditLog)

      expect(response.entity).toBe("Portfolio")
      expect(response.entityId).toBe("portfolio-77")
    })

    it("should carry the action when serializing an audit log", () => {
      const auditLog = buildAuditLog({ action: "DELETED" })

      const response = toResponseDTO(auditLog)

      expect(response.action).toBe("DELETED")
    })

    it("should expose null changes when the audit log captured none", () => {
      const auditLog = buildAuditLog({ changes: null })

      const response = toResponseDTO(auditLog)

      expect(response.changes).toBeNull()
    })

    it("should carry the recorded changes when the audit log captured some", () => {
      const auditLog = buildAuditLog({
        changes: { name: { from: "FIA", to: "FII" } },
      })

      const response = toResponseDTO(auditLog)

      expect(response.changes).toEqual({
        name: { from: "FIA", to: "FII" },
      })
    })

    it("should expose a null user id when the audit log was written by the system", () => {
      const auditLog = buildAuditLog({ userId: null })

      const response = toResponseDTO(auditLog)

      expect(response.userId).toBeNull()
    })

    it("should carry the acting user id when the audit log was written by a user", () => {
      const auditLog = buildAuditLog({
        userId: buildEntityId("user-3"),
      })

      const response = toResponseDTO(auditLog)

      expect(response.userId).toBe("user-3")
    })

    it("should expose the creation timestamp as an ISO 8601 string when serializing an audit log", () => {
      const auditLog = buildAuditLog({
        createdAt: new Date("2026-03-10T08:15:00.000Z"),
      })

      const response = toResponseDTO(auditLog)

      expect(response.createdAt).toBe("2026-03-10T08:15:00.000Z")
    })
  })
})
