import { describe, expect, it } from "vitest";

import { Session } from "@/business/entities/user/session.entity";

describe("Session.create", () => {
  const VALID_PROPS = {
    userId: "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    token: "session-token",
    expiresAt: new Date("2026-02-01T00:00:00.000Z"),
  };

  it("creates a valid session with default values", () => {
    const SESSION = Session.create(VALID_PROPS);

    expect(SESSION.id).toBeUndefined();
    expect(SESSION.userId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(SESSION.token).toBe("session-token");
    expect(SESSION.expiresAt).toEqual(new Date("2026-02-01T00:00:00.000Z"));
    expect(SESSION.ipAddress).toBeNull();
    expect(SESSION.userAgent).toBeNull();
    expect(SESSION.createdAt).toBeInstanceOf(Date);
    expect(SESSION.updatedAt).toBeInstanceOf(Date);
  });

  it("creates a session with the provided id", () => {
    const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

    const SESSION = Session.create(VALID_PROPS, ID);

    expect(SESSION.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");

    const SESSION = Session.create({
      ...VALID_PROPS,
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(SESSION.ipAddress).toBe("127.0.0.1");
    expect(SESSION.userAgent).toBe("Mozilla/5.0");
    expect(SESSION.createdAt).toBe(CREATED_AT);
    expect(SESSION.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the user id is blank", () => {
    expect(() => Session.create({ ...VALID_PROPS, userId: " " })).toThrow(
      "Session must have a user id.",
    );
  });

  it("throws when the token is blank", () => {
    expect(() => Session.create({ ...VALID_PROPS, token: " " })).toThrow(
      "Session must have a token.",
    );
  });

  it("throws when the expiration date is missing", () => {
    const { expiresAt: _, ...REST } = VALID_PROPS;

    expect(() =>
      Session.create(REST as Parameters<typeof Session.create>[0]),
    ).toThrow("Session must have an expiration date.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Session.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Session.equals", () => {
  const VALID_PROPS = {
    userId: "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    token: "session-token",
    expiresAt: new Date("2026-02-01T00:00:00.000Z"),
  };
  const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

  it("returns true for the same instance", () => {
    const SESSION = Session.create(VALID_PROPS, ID);

    expect(SESSION.equals(SESSION)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Session.create(VALID_PROPS, ID);
    const B = Session.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Session.create(VALID_PROPS, ID);
    const B = Session.create(
      VALID_PROPS,
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Session.create(VALID_PROPS, ID);
    const B = Session.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const SESSION = Session.create(VALID_PROPS, ID);

    expect(SESSION.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const SESSION = Session.create(VALID_PROPS, ID);

    expect(SESSION.equals(undefined)).toBe(false);
  });
});
