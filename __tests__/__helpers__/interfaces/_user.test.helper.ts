import { User } from "@/business/entities/user/user.entity";
import type { IUser } from "@/business/interfaces/user/user.interface";

export const USER_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

export const USER = User.create(
  {
    name: "José da Silva",
    email: "jose@example.com",
    firstName: "José",
    lastName: "da Silva",
    cpf: "24301457030",
  },
  USER_ID,
);

export function createInMemoryUserRepository(): IUser {
  const ROWS = new Map<string, User>();

  return {
    async findById(id: string): Promise<User | null> {
      return ROWS.get(id) ?? null;
    },
    async findByEmail(email: string): Promise<User | null> {
      for (const ROW of ROWS.values()) {
        if (ROW.email === email) return ROW;
      }

      return null;
    },
    async findByCpf(cpf: string): Promise<User | null> {
      for (const ROW of ROWS.values()) {
        if (ROW.cpf === cpf) return ROW;
      }

      return null;
    },
    async save(user: User): Promise<User> {
      ROWS.set(user.id ?? "generated-id", user);

      return user;
    },
    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
