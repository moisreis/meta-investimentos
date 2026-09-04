import { describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  resolveActorFromSession,
  resolveActorIdFromSession,
} from "@/business/use-cases/shared/actor-resolution";
import { ValidationError } from "@/shared/errors";

const USER_ID = ID.USER.DEFAULT;

describe("resolveActorFromSession", () => {
  it("resolves the actor id and role from an authenticated session", () => {
    const RESULT = resolveActorFromSession({ id: USER_ID, role: "MANAGER" });

    expect(RESULT?.actorId).toBe(USER_ID);
    expect(RESULT?.role).toBe("MANAGER");
  });

  it("defaults the role to USER when the session carries none", () => {
    const RESULT = resolveActorFromSession({ id: USER_ID });

    expect(RESULT?.role).toBe("USER");
  });

  it("returns null when the session has no user", () => {
    expect(resolveActorFromSession(null)).toBeNull();
    expect(resolveActorFromSession(undefined)).toBeNull();
  });

  it("returns null when the session user id is blank", () => {
    expect(resolveActorFromSession({ id: "" })).toBeNull();
    expect(resolveActorFromSession({ id: "   " })).toBeNull();
  });

  it("throws ValidationError when the session user id is not a valid uuid", () => {
    expect(() => resolveActorFromSession({ id: "not-a-uuid" })).toThrow(
      ValidationError,
    );
  });
});

describe("resolveActorIdFromSession", () => {
  it("resolves the actor id from an authenticated session", () => {
    expect(resolveActorIdFromSession({ id: USER_ID })).toBe(USER_ID);
  });

  it("returns null when the session has no user", () => {
    expect(resolveActorIdFromSession(null)).toBeNull();
  });

  it("throws ValidationError when the session user id is not a valid uuid", () => {
    expect(() => resolveActorIdFromSession({ id: "bad" })).toThrow(
      ValidationError,
    );
  });
});
