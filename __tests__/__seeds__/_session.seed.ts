import { db } from "@/__tests__/__setup__/_database.setup";
import { Session } from "@/business/entities";
import { session } from "@/infrastructure/database/schemas";
import { EXPIRES_AT, OTHER_USER_ID, seedUserById, USER_ID } from "./_user.seed";

export const SESSION_ID = "c3d4e5f6-7a8b-4c9d-8e0f-1a2b3c4d5e6f";
export const OTHER_SESSION_ID = "d4e5f6a7-8b9c-4d0e-9f1a-2b3c4d5e6f7a";
export const THIRD_SESSION_ID = "e5f6a7b8-9c0d-4e1f-8a2b-3c4d5e6f7a8b";

export const SESSION = Session.create(
  {
    userId: USER_ID,
    token: "session-token",
    expiresAt: EXPIRES_AT,
  },
  SESSION_ID,
);

export const OTHER_SESSION = Session.create(
  {
    userId: OTHER_USER_ID,
    token: "other-session-token",
    expiresAt: EXPIRES_AT,
  },
  OTHER_SESSION_ID,
);

export const THIRD_SESSION = Session.create(
  {
    userId: USER_ID,
    token: "third-session-token",
    expiresAt: EXPIRES_AT,
  },
  THIRD_SESSION_ID,
);

export const SESSIONS = [SESSION, OTHER_SESSION];

export const UPDATED_SESSION = Session.create(
  {
    userId: USER_ID,
    token: "updated-session-token",
    expiresAt: EXPIRES_AT,
  },
  SESSION_ID,
);

export const FRESH_SESSION = Session.create({
  userId: USER_ID,
  token: "fresh-session-token",
  expiresAt: EXPIRES_AT,
});

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

export async function seedThirdSession(): Promise<Session> {
  await seedUserById(THIRD_SESSION.userId);

  await db
    .insert(session)
    .values({ ...toSessionRow(THIRD_SESSION), id: THIRD_SESSION.id });

  return THIRD_SESSION;
}
