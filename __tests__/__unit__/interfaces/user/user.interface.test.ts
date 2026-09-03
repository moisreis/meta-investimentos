import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemoryUserRepository,
  USER,
  USER_ID,
} from "@/__tests__/__helpers__/interfaces/_user.test.helper";

import { User } from "@/business/entities/user/user.entity";
import type { IUser } from "@/business/interfaces/user/user.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("IUser", () => {
  let REPOSITORY: IUser;

  beforeEach(() => {
    REPOSITORY = createInMemoryUserRepository();
  });

  describe("findById", () => {
    it("returns the persisted user", async () => {
      await REPOSITORY.save(USER);

      const FOUND = await REPOSITORY.findById(EntityId.create(USER_ID));

      expect(FOUND?.equals(USER)).toBe(true);
    });

    it("returns null when the user does not exist", async () => {
      expect(await REPOSITORY.findById(EntityId.create(USER_ID))).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("returns the persisted user", async () => {
      await REPOSITORY.save(USER);

      const FOUND = await REPOSITORY.findByEmail(USER.email);

      expect(FOUND?.equals(USER)).toBe(true);
    });

    it("returns null when no user has the email", async () => {
      expect(await REPOSITORY.findByEmail(USER.email)).toBeNull();
    });
  });

  describe("findByCpf", () => {
    it("returns the persisted user", async () => {
      await REPOSITORY.save(USER);

      const FOUND = await REPOSITORY.findByCpf(USER.cpf.value);

      expect(FOUND?.equals(USER)).toBe(true);
    });

    it("returns null when no user has the cpf", async () => {
      expect(await REPOSITORY.findByCpf(USER.cpf.value)).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new user", async () => {
      const SAVED = await REPOSITORY.save(USER);

      expect(SAVED.equals(USER)).toBe(true);
      expect(
        (await REPOSITORY.findById(EntityId.create(USER_ID)))?.equals(USER),
      ).toBe(true);
    });

    it("updates an existing user", async () => {
      await REPOSITORY.save(USER);

      const UPDATED = User.create(
        {
          name: "José da Silva Junior",
          email: USER.email,
          firstName: USER.firstName,
          lastName: "da Silva Junior",
          cpf: USER.cpf,
        },
        USER_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(EntityId.create(USER_ID));

      expect(FOUND?.name).toBe("José da Silva Junior");
      expect(FOUND?.equals(UPDATED)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted user", async () => {
      await REPOSITORY.save(USER);

      await REPOSITORY.delete(EntityId.create(USER_ID));

      expect(await REPOSITORY.findById(EntityId.create(USER_ID))).toBeNull();
    });
  });
});
