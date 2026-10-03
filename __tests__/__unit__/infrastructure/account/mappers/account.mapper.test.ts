import { describe, it, expect } from "vitest"

import { Account } from "@/domain/account/entities/account.entity"
import { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/account/mappers/account.mapper"
import { buildAccount } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000036"
const USER_ID = "user-1"

describe("infrastructure/account/mappers/account.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Account entity", () => {
      const row = {
        id: ID,
        accountId: "test@example.com",
        providerId: "credential",
        userId: USER_ID,
        accessToken: "access-token",
        refreshToken: "refresh-token",
        idToken: "id-token",
        accessTokenExpiresAt: new Date(
          "2026-01-01T00:00:00.000Z"
        ),
        refreshTokenExpiresAt: new Date(
          "2026-02-01T00:00:00.000Z"
        ),
        scope: "openid email",
        password: "hashed-password",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const account = ToDomain(row)

      expect(account.id).toBe(EntityId.create(ID))
      expect(account.accountId).toBe("test@example.com")
      expect(account.providerId).toBe("credential")
      expect(account.userId).toBe(EntityId.create(USER_ID))
      expect(account.accessToken).toBe("access-token")
      expect(account.refreshToken).toBe("refresh-token")
      expect(account.idToken).toBe("id-token")
      expect(account.accessTokenExpiresAt).toEqual(
        row.accessTokenExpiresAt
      )
      expect(account.refreshTokenExpiresAt).toEqual(
        row.refreshTokenExpiresAt
      )
      expect(account.scope).toBe("openid email")
      expect(account.password).toBe("hashed-password")
      expect(account.createdAt).toEqual(row.createdAt)
      expect(account.updatedAt).toEqual(row.updatedAt)
    })

    it("should map null optional columns to null", () => {
      const row = {
        id: ID,
        accountId: "test@example.com",
        providerId: "credential",
        userId: USER_ID,
        accessToken: null,
        refreshToken: null,
        idToken: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        scope: null,
        password: null,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      }

      const account = ToDomain(row)

      expect(account.accessToken).toBeNull()
      expect(account.refreshToken).toBeNull()
      expect(account.idToken).toBeNull()
      expect(account.accessTokenExpiresAt).toBeNull()
      expect(account.refreshTokenExpiresAt).toBeNull()
      expect(account.scope).toBeNull()
      expect(account.password).toBeNull()
      expect(account.issuer).toBe("better-auth")
    })
  })

  describe("ToInsert", () => {
    it("should map Account entity to insert object without id", () => {
      const account = buildAccount()

      const insert = ToInsert(account)

      expect(insert).not.toHaveProperty("id")
      expect(insert.accountId).toBe("test@example.com")
      expect(insert.providerId).toBe("credential")
      expect(insert.userId).toBe(USER_ID)
      expect(insert.accessToken).toBeNull()
      expect(insert.createdAt).toEqual(account.createdAt)
      expect(insert.updatedAt).toEqual(account.updatedAt)
    })
  })

  describe("ToUpdate", () => {
    it("should map Account entity to update object without timestamps", () => {
      const account = buildAccount()

      const update = ToUpdate(account)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update.providerId).toBe(account.providerId)
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Account.create(
        {
          providerId: "google",
          accountId: "google-account-id",
          userId: EntityId.create(USER_ID),
          accessToken: "access-token",
          scope: "openid",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToInsert(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.providerId).toBe("google")
      expect(restored.accessToken).toBe("access-token")
      expect(restored.refreshToken).toBeNull()
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = Account.create(
        {
          providerId: "credential",
          accountId: "test@example.com",
          userId: EntityId.create(USER_ID),
          password: "hashed-password",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToUpdate(original),
        id: original.id!,
        createdAt: original.createdAt,
        updatedAt: original.updatedAt,
      } as Parameters<typeof ToDomain>[0]

      expect(ToDomain(row).equals(original)).toBe(true)
    })
  })
})
