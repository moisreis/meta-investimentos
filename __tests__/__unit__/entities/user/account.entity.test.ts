import { describe, expect, it } from "vitest";

import { Account } from "@/business/entities/user/account.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("Account.create", () => {
  const VALID_PROPS = {
    issuer: "github",
    providerId: "github",
    accountId: "octocat",
    userId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
  };

  it("creates a valid account with default values", () => {
    const ACCOUNT = Account.create(VALID_PROPS);

    expect(ACCOUNT.id).toBeUndefined();
    expect(ACCOUNT.issuer).toBe("github");
    expect(ACCOUNT.providerId).toBe("github");
    expect(ACCOUNT.accountId).toBe("octocat");
    expect(ACCOUNT.userId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(ACCOUNT.accessToken).toBeNull();
    expect(ACCOUNT.refreshToken).toBeNull();
    expect(ACCOUNT.idToken).toBeNull();
    expect(ACCOUNT.accessTokenExpiresAt).toBeNull();
    expect(ACCOUNT.refreshTokenExpiresAt).toBeNull();
    expect(ACCOUNT.scope).toBeNull();
    expect(ACCOUNT.password).toBeNull();
    expect(ACCOUNT.createdAt).toBeInstanceOf(Date);
    expect(ACCOUNT.updatedAt).toBeInstanceOf(Date);
  });

  it("creates an account with the provided id", () => {
    const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

    const ACCOUNT = Account.create(VALID_PROPS, ID);

    expect(ACCOUNT.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");
    const EXPIRES_AT = new Date("2026-02-01T00:00:00.000Z");

    const ACCOUNT = Account.create({
      ...VALID_PROPS,
      accessToken: "access-token",
      refreshToken: "refresh-token",
      idToken: "id-token",
      accessTokenExpiresAt: EXPIRES_AT,
      refreshTokenExpiresAt: EXPIRES_AT,
      scope: "read:user",
      password: "secret-hash",
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(ACCOUNT.accessToken).toBe("access-token");
    expect(ACCOUNT.refreshToken).toBe("refresh-token");
    expect(ACCOUNT.idToken).toBe("id-token");
    expect(ACCOUNT.accessTokenExpiresAt).toBe(EXPIRES_AT);
    expect(ACCOUNT.refreshTokenExpiresAt).toBe(EXPIRES_AT);
    expect(ACCOUNT.scope).toBe("read:user");
    expect(ACCOUNT.password).toBe("secret-hash");
    expect(ACCOUNT.createdAt).toBe(CREATED_AT);
    expect(ACCOUNT.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the issuer is blank", () => {
    expect(() => Account.create({ ...VALID_PROPS, issuer: " " })).toThrow(
      "Account must have an issuer.",
    );
  });

  it("throws when the provider id is blank", () => {
    expect(() => Account.create({ ...VALID_PROPS, providerId: "" })).toThrow(
      "Account must have a provider id.",
    );
  });

  it("throws when the account id is blank", () => {
    expect(() => Account.create({ ...VALID_PROPS, accountId: "  " })).toThrow(
      "Account must have an account id.",
    );
  });

  it("throws when the user id is blank", () => {
    expect(() =>
      Account.create({ ...VALID_PROPS, userId: " " as unknown as EntityId }),
    ).toThrow("Account must have a user id.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Account.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Account.equals", () => {
  const VALID_PROPS = {
    issuer: "github",
    providerId: "github",
    accountId: "octocat",
    userId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
  };
  const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

  it("returns true for the same instance", () => {
    const ACCOUNT = Account.create(VALID_PROPS, ID);

    expect(ACCOUNT.equals(ACCOUNT)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Account.create(VALID_PROPS, ID);
    const B = Account.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Account.create(VALID_PROPS, ID);
    const B = Account.create(
      VALID_PROPS,
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Account.create(VALID_PROPS, ID);
    const B = Account.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const ACCOUNT = Account.create(VALID_PROPS, ID);

    expect(ACCOUNT.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const ACCOUNT = Account.create(VALID_PROPS, ID);

    expect(ACCOUNT.equals(undefined)).toBe(false);
  });
});
