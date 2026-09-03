import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { ISession } from "@/business/interfaces/user/session.interface";
import { Session } from "@/business/entities/user/session.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the shared expiration date for session fixtures.
 *
 * The date is `2026-02-01T00:00:00.000Z`.
 */
const EXPIRES_AT = new Date("2026-02-01T00:00:00.000Z");

/**
 * Represents the default session fixture for tests.
 *
 * The fixture links to the default user and has the token
 * `session-token`.
 */
const SESSION = Session.create(
  {
    userId: EntityId.create(ID.USER.DEFAULT),
    token: "session-token",
    expiresAt: EXPIRES_AT,
  },
  ID.SESSION.DEFAULT,
);

/**
 * Represents an alternative session fixture for tests.
 *
 * The fixture links to the alternative user and has the
 * token `other-session-token`.
 */
const OTHER_SESSION = Session.create(
  {
    userId: EntityId.create(ID.USER.OTHER),
    token: "other-session-token",
    expiresAt: EXPIRES_AT,
  },
  ID.SESSION.OTHER,
);

/**
 * Represents an updated version of the default session fixture.
 *
 * The fixture keeps the same ID as the default session. The
 * token changes to `updated-session-token`.
 */
const UPDATED_SESSION = Session.create(
  {
    userId: EntityId.create(ID.USER.DEFAULT),
    token: "updated-session-token",
    expiresAt: EXPIRES_AT,
  },
  ID.SESSION.DEFAULT,
);

/**
 * Represents a session fixture without a predefined ID.
 *
 * The fixture links to the default user and has the token
 * `fresh-session-token`. The code generates the ID at
 * creation.
 */
const FRESH_SESSION = Session.create({
  userId: EntityId.create(ID.USER.DEFAULT),
  token: "fresh-session-token",
  expiresAt: EXPIRES_AT,
});

/**
 * Represents the entity ID of the default session fixture.
 */
const SESSION_ID = ID.SESSION.DEFAULT;

/**
 * Represents the entity ID of the alternative session fixture.
 */
const OTHER_SESSION_ID = ID.SESSION.OTHER;

/**
 * Represents the entity ID of the default user fixture.
 */
const USER_ID = ID.USER.DEFAULT;

/**
 * Represents the entity ID of the alternative user fixture.
 */
const OTHER_USER_ID = ID.USER.OTHER;

export {
  EXPIRES_AT,
  FRESH_SESSION,
  OTHER_SESSION,
  OTHER_SESSION_ID,
  OTHER_USER_ID,
  SESSION,
  SESSION_ID,
  UPDATED_SESSION,
  USER_ID,
};

/**
 * Creates an in-memory implementation of the {@link ISession}
 * repository interface.
 *
 * The repository stores {@link Session} instances in memory
 * and supports lookup by ID, by token, and by user ID. Use
 * this factory in unit tests that need a persistent but
 * isolated session store.
 *
 * @returns A fresh {@link ISession} instance backed by memory.
 */
export function createInMemorySessionRepository(): ISession {
  const BASE = createInMemoryRepository<Awaited<ReturnType<ISession["save"]>>>({
    extractId: (s) => s.id,
  });

  return {
    findById: (id) => BASE.findById(id),
    async findByToken(token) {
      return BASE.findOne((s) => s.token === token);
    },
    async findAllByUserId(userId) {
      return BASE.match((s) => s.userId === userId);
    },
    save: (session) => BASE.save(session),
    delete: (id) => BASE.delete(id),
  };
}
