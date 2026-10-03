import { describe, it, expect } from "vitest"

import { Account } from "@/domain/account/entities/account.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildAccount } from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("account-123")

describe("Account", () => {
  describe("create", () => {
    it("should create a valid Account with required props", () => {
      const account = Account.create({
        providerId: "credential",
        accountId: "test@example.com",
        userId: EntityId.create("user-1"),
      })

      expect(account.providerId).toBe("credential")
      expect(account.accountId).toBe("test@example.com")
      expect(account.userId).toBe(EntityId.create("user-1"))
      expect(account.issuer).toBe("better-auth")
      expect(account.accessToken).toBeNull()
      expect(account.refreshToken).toBeNull()
      expect(account.idToken).toBeNull()
      expect(account.accessTokenExpiresAt).toBeNull()
      expect(account.refreshTokenExpiresAt).toBeNull()
      expect(account.scope).toBeNull()
      expect(account.password).toBeNull()
      expect(account.id).toBeUndefined()
    })

    it("should create an Account with provided id", () => {
      const account = Account.create(
        {
          providerId: "credential",
          accountId: "test@example.com",
          userId: EntityId.create("user-1"),
        },
        PERSISTED_ID
      )

      expect(account.id).toBe(PERSISTED_ID)
    })

    it("should create an Account with optional props", () => {
      const accessTokenExpiresAt = new Date(
        "2026-01-01T00:00:00.000Z"
      )
      const refreshTokenExpiresAt = new Date(
        "2026-02-01T00:00:00.000Z"
      )

      const account = Account.create({
        providerId: "google",
        accountId: "google-account-id",
        userId: EntityId.create("user-1"),
        accessToken: "access-token",
        refreshToken: "refresh-token",
        idToken: "id-token",
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        scope: "openid email",
        password: "hashed-password",
        issuer: "custom-issuer",
      })

      expect(account.accessToken).toBe("access-token")
      expect(account.refreshToken).toBe("refresh-token")
      expect(account.idToken).toBe("id-token")
      expect(account.accessTokenExpiresAt).toEqual(
        accessTokenExpiresAt
      )
      expect(account.refreshTokenExpiresAt).toEqual(
        refreshTokenExpiresAt
      )
      expect(account.scope).toBe("openid email")
      expect(account.password).toBe("hashed-password")
      expect(account.issuer).toBe("custom-issuer")
    })

    it("should throw ValidationError when providerId is blank", () => {
      expect(() =>
        Account.create({
          providerId: "  ",
          accountId: "test@example.com",
          userId: EntityId.create("user-1"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when accountId is blank", () => {
      expect(() =>
        Account.create({
          providerId: "credential",
          accountId: "",
          userId: EntityId.create("user-1"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when userId is blank", () => {
      expect(() =>
        Account.create({
          providerId: "credential",
          accountId: "test@example.com",
          userId: EntityId.create("   "),
        })
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const account = buildAccount()

      expect(account.equals(account)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildAccount({ id: PERSISTED_ID })
      const second = buildAccount({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildAccount({
        id: EntityId.create("account-1"),
      })
      const second = buildAccount({
        id: EntityId.create("account-2"),
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildAccount()
      const second = buildAccount({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildAccount({ id: PERSISTED_ID })
      const second = buildAccount()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const account = buildAccount()

      expect(account.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const account = buildAccount()

      expect(account.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const account = buildAccount()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        account.accountId = "other@example.com"
      }).toThrow(TypeError)
    })
  })
})
