import { describe, expect, it } from "vitest";

import { User, type UserRole } from "@/business/entities/user/user.entity";

describe("User.create", () => {
  const VALID_PROPS = {
    name: "José da Silva",
    email: "jose@example.com",
    firstName: "José",
    lastName: "da Silva",
    cpf: "24301457030",
  };

  it("creates a valid user with default values", () => {
    const USER = User.create(VALID_PROPS);

    expect(USER.id).toBeUndefined();
    expect(USER.name).toBe("José da Silva");
    expect(USER.email).toBe("jose@example.com");
    expect(USER.firstName).toBe("José");
    expect(USER.lastName).toBe("da Silva");
    expect(USER.cpf).toBe("24301457030");
    expect(USER.role).toBe("USER");
    expect(USER.emailVerified).toBe(false);
    expect(USER.image).toBeNull();
    expect(USER.createdAt).toBeInstanceOf(Date);
    expect(USER.updatedAt).toBeInstanceOf(Date);
  });

  it("creates a user with the provided id", () => {
    const USER = User.create(
      VALID_PROPS,
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );

    expect(USER.id).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");
    const role: UserRole = "MANAGER";

    const USER = User.create(
      {
        ...VALID_PROPS,
        role,
        emailVerified: true,
        image: "https://example.com/jose.png",
        createdAt: CREATED_AT,
        updatedAt: UPDATED_AT,
      },
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );

    expect(USER.role).toBe("MANAGER");
    expect(USER.emailVerified).toBe(true);
    expect(USER.image).toBe("https://example.com/jose.png");
    expect(USER.createdAt).toBe(CREATED_AT);
    expect(USER.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the name is blank", () => {
    expect(() => User.create({ ...VALID_PROPS, name: "   " })).toThrow(
      "User must have a name.",
    );
  });

  it("throws when the email is not valid", () => {
    expect(() =>
      User.create({ ...VALID_PROPS, email: "jose.example.com" }),
    ).toThrow("User must have a valid email.");
  });

  it("throws when the first name is blank", () => {
    expect(() => User.create({ ...VALID_PROPS, firstName: " " })).toThrow(
      "User must have a first name.",
    );
  });

  it("throws when the last name is blank", () => {
    expect(() => User.create({ ...VALID_PROPS, lastName: "" })).toThrow(
      "User must have a last name.",
    );
  });

  it("throws when the cpf is blank", () => {
    expect(() => User.create({ ...VALID_PROPS, cpf: "   " })).toThrow(
      "User must have a valid cpf.",
    );
  });

  it("throws when the role is not a valid user role", () => {
    expect(() =>
      User.create({ ...VALID_PROPS, role: "ADMIN" as UserRole }),
    ).toThrow("User must have a valid role.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    User.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("User.equals", () => {
  const VALID_PROPS = {
    name: "José da Silva",
    email: "jose@example.com",
    firstName: "José",
    lastName: "da Silva",
    cpf: "24301457030",
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const USER = User.create(VALID_PROPS, ID);

    expect(USER.equals(USER)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = User.create(VALID_PROPS, ID);
    const B = User.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = User.create(VALID_PROPS, ID);
    const B = User.create(VALID_PROPS, "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d");

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = User.create(VALID_PROPS, ID);
    const B = User.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const USER = User.create(VALID_PROPS, ID);

    expect(USER.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const USER = User.create(VALID_PROPS, ID);

    expect(USER.equals(undefined)).toBe(false);
  });
});
