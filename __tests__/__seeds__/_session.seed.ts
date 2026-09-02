import {
  FRESH_SESSION,
  OTHER_SESSION,
  OTHER_SESSION_ID,
  OTHER_USER_ID,
  SESSION,
  SESSION_ID,
  SESSIONS,
  THIRD_SESSION,
  THIRD_SESSION_ID,
  UPDATED_SESSION,
  USER_ID,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Session } from "@/business/entities";
import { session } from "@/infrastructure/database/schemas";
import { seedUserById } from "./_user.seed";

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
