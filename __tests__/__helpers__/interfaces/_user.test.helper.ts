import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IUser } from "@/business/interfaces/user/user.interface";

export {
  FRESH_USER,
  OTHER_USER,
  OTHER_USER_ID,
  UPDATED_USER,
  USER,
  USER_ID,
} from "@/__tests__/__fixtures__";

export function createInMemoryUserRepository(): IUser {
  const BASE = createInMemoryRepository<Awaited<ReturnType<IUser["save"]>>>({
    extractId: (u) => u.id,
  });

  return {
    findById: (id) => BASE.findById(id),
    async findByEmail(email) {
      return BASE.findOne((u) => u.email === email);
    },
    async findByCpf(cpf) {
      return BASE.findOne((u) => u.cpf.value === cpf);
    },
    save: (user) => BASE.save(user),
    delete: (id) => BASE.delete(id),
  };
}
