import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { ISession } from "@/business/interfaces/user/session.interface";

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
} from "@/__tests__/__fixtures__";

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
