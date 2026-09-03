import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Session } from "@/business/entities";
import { Session as SessionEntity } from "@/business/entities/user/session.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { session } from "@/infrastructure/database/schemas";
import { seedUserById } from "./_user.seed";

/**
 * Represents the shared expiration date for session fixtures.
 */
const EXPIRES_AT = new Date("2026-02-01T00:00:00.000Z");

/**
 * Represents the default session fixture for tests.
 *
 * Creates a `Session` linked to the default user with
 * the `session-token` token value.
 */
const SESSION = SessionEntity.create(
  {
    userId: EntityId.create(ID.USER.DEFAULT),
    token: "session-token",
    expiresAt: EXPIRES_AT,
  },
  ID.SESSION.DEFAULT,
);

/**
 * Represents a secondary session fixture for tests.
 *
 * Creates a `Session` linked to the other user with
 * the `other-session-token` token value.
 */
const OTHER_SESSION = SessionEntity.create(
  {
    userId: EntityId.create(ID.USER.OTHER),
    token: "other-session-token",
    expiresAt: EXPIRES_AT,
  },
  ID.SESSION.OTHER,
);

/**
 * Represents a third session fixture for tests.
 *
 * Creates a `Session` linked to the default user with
 * the `third-session-token` token value.
 */
const THIRD_SESSION = SessionEntity.create(
  {
    userId: EntityId.create(ID.USER.DEFAULT),
    token: "third-session-token",
    expiresAt: EXPIRES_AT,
  },
  ID.SESSION.THIRD,
);

/**
 * Represents an updated version of the default session fixture.
 *
 * Creates a `Session` with the same ID as `SESSION` but with
 * the `updated-session-token` token value.
 */
const UPDATED_SESSION = SessionEntity.create(
  {
    userId: EntityId.create(ID.USER.DEFAULT),
    token: "updated-session-token",
    expiresAt: EXPIRES_AT,
  },
  ID.SESSION.DEFAULT,
);

/**
 * Represents a fresh session fixture without a fixed ID.
 *
 * Creates a `Session` with the `fresh-session-token` token
 * value. The entity generates a new ID when created.
 */
const FRESH_SESSION = SessionEntity.create({
  userId: EntityId.create(ID.USER.DEFAULT),
  token: "fresh-session-token",
  expiresAt: EXPIRES_AT,
});

/**
 * Represents the default pair of session fixtures for tests.
 */
const SESSIONS = [SESSION, OTHER_SESSION];

/**
 * Represents the default session ID used in tests.
 */
const SESSION_ID = ID.SESSION.DEFAULT;

/**
 * Represents the other session ID used in tests.
 */
const OTHER_SESSION_ID = ID.SESSION.OTHER;

/**
 * Represents the third session ID used in tests.
 */
const THIRD_SESSION_ID = ID.SESSION.THIRD;

/**
 * Represents the default user ID used in session tests.
 */
const USER_ID = ID.USER.DEFAULT;

/**
 * Represents the other user ID used in session tests.
 */
const OTHER_USER_ID = ID.USER.OTHER;

export {
  SESSION_ID,
  OTHER_SESSION_ID,
  THIRD_SESSION_ID,
  SESSION,
  OTHER_SESSION,
  THIRD_SESSION,
  UPDATED_SESSION,
  FRESH_SESSION,
  SESSIONS,
};

function toSessionRow(entity: Session): typeof session.$inferInsert {
  return {
    userId: entity.userId,
    token: entity.token,
    expiresAt: entity.expiresAt,
    ipAddress: entity.ipAddress,
    userAgent: entity.userAgent,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

/**
 * Seeds the default and other session fixtures into the database.
 *
 * Inserts the `SESSION` and `OTHER_SESSION` fixtures. Creates
 * the linked user rows first when they do not exist.
 *
 * @returns An array containing the seeded `SESSION` and
 *          `OTHER_SESSION` instances.
 */
export async function seedSessions(): Promise<Session[]> {
  await seedUserById(USER_ID);
  await seedUserById(OTHER_USER_ID);

  for (const fixture of [SESSION, OTHER_SESSION]) {
    await db
      .insert(session)
      .values({ ...toSessionRow(fixture), id: fixture.id });
  }

  return [SESSION, OTHER_SESSION];
}

/**
 * Seeds the third session fixture into the database.
 *
 * Inserts the `THIRD_SESSION` fixture. Creates the linked
 * user row first when it does not exist.
 *
 * @returns The seeded `THIRD_SESSION` instance.
 */
export async function seedThirdSession(): Promise<Session> {
  await seedUserById(THIRD_SESSION.userId);

  await db
    .insert(session)
    .values({ ...toSessionRow(THIRD_SESSION), id: THIRD_SESSION.id });

  return THIRD_SESSION;
}
