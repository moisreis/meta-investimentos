import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IUser } from "@/business/interfaces/user/user.interface";
import { User } from "@/business/entities/user/user.entity";
import { CPF } from "@/business/value-objects/cpf.vo";

/**
 * Represents the default user fixture for tests.
 *
 * The fixture has the name "José da Silva", the email
 * `jose@example.com`, and the CPF `52998224725`.
 */
const USER = User.create(
  {
    name: "José da Silva",
    email: "jose@example.com",
    firstName: "José",
    lastName: "da Silva",
    cpf: CPF.create("52998224725"),
  },
  ID.USER.DEFAULT,
);

/**
 * Represents an alternative user fixture for tests.
 *
 * The fixture has the name "Maria Souza", the email
 * `maria@example.com`, and the CPF `12345678909`.
 */
const OTHER_USER = User.create(
  {
    name: "Maria Souza",
    email: "maria@example.com",
    firstName: "Maria",
    lastName: "Souza",
    cpf: CPF.create("12345678909"),
  },
  ID.USER.OTHER,
);

/**
 * Represents a user fixture without a predefined ID.
 *
 * The fixture has the name "Felipe Rocha" and the email
 * `felipe@example.com`. The code generates the ID at creation.
 */
const FRESH_USER = User.create({
  name: "Felipe Rocha",
  email: "felipe@example.com",
  firstName: "Felipe",
  lastName: "Rocha",
  cpf: CPF.create("11144477735"),
});

/**
 * Represents an updated version of the default user fixture.
 *
 * The fixture keeps the same ID, email, first name, and CPF
 * as the default user. The last name changes to "da Silva
 * Junior".
 */
const UPDATED_USER = User.create(
  {
    name: "José da Silva Junior",
    email: USER.email,
    firstName: USER.firstName,
    lastName: "da Silva Junior",
    cpf: USER.cpf,
  },
  ID.USER.DEFAULT,
);

/**
 * Represents the entity ID of the default user fixture.
 */
const USER_ID = ID.USER.DEFAULT;

/**
 * Represents the entity ID of the alternative user fixture.
 */
const OTHER_USER_ID = ID.USER.OTHER;

export {
  FRESH_USER,
  OTHER_USER,
  OTHER_USER_ID,
  UPDATED_USER,
  USER,
  USER_ID,
};

/**
 * Creates an in-memory implementation of the {@link IUser}
 * repository interface.
 *
 * The repository stores {@link User} instances in memory and
 * supports lookup by ID, email, and CPF. Use this factory
 * in unit tests that need a persistent but isolated user
 * store.
 *
 * @returns A fresh {@link IUser} instance backed by memory.
 */
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
