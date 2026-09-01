import { Session } from "@/business/entities/user/session.entity";
import type { ISession } from "@/business/interfaces/user/session.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

export const SESSION_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const OTHER_SESSION_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const USER_ID = "9f5d9a1b-2c6e-4a3b-9c1d-3e2f4a6b8c0d";
export const OTHER_USER_ID = "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d";
export const EXPIRES_AT = new Date("2026-02-01T00:00:00.000Z");

export const SESSION = Session.create(
  {
    userId: EntityId.create(USER_ID),
    token: "session-token",
    expiresAt: EXPIRES_AT,
  },
  SESSION_ID,
);

export const OTHER_SESSION = Session.create(
  {
    userId: EntityId.create(OTHER_USER_ID),
    token: "other-session-token",
    expiresAt: EXPIRES_AT,
  },
  OTHER_SESSION_ID,
);

export function createInMemorySessionRepository(): ISession {
  const ROWS = new Map<string, Session>();

  return {
    async findById(id: string): Promise<Session | null> {
      return ROWS.get(id) ?? null;
    },
    async findByToken(token: string): Promise<Session | null> {
      for (const ROW of ROWS.values()) {
        if (ROW.token === token) return ROW;
      }

      return null;
    },
    async findAllByUserId(userId: string): Promise<Session[]> {
      const MATCHES: Session[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.userId === userId) MATCHES.push(ROW);
      }

      return MATCHES;
    },
    async save(session: Session): Promise<Session> {
      ROWS.set(session.id ?? "generated-id", session);

      return session;
    },
    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
