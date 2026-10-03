import { describe, it, expect, beforeEach } from "vitest"

import { ListUsersByIdsUseCase } from "@/services/user/use-cases/list-users-by-ids.use-case"
import { createFakeUserRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildUniqueCpf,
  buildUser,
} from "__tests__/__setup__/_factories.setup"

const FIRST_ID = "00000000-0000-0000-0000-000000000051"
const SECOND_ID = "00000000-0000-0000-0000-000000000052"
const MISSING_ID = "00000000-0000-0000-0000-000000000059"

describe("services/user/use-cases/list-users-by-ids.use-case", () => {
  let userRepository: ReturnType<typeof createFakeUserRepository>

  beforeEach(() => {
    userRepository = createFakeUserRepository()
  })

  describe("execute", () => {
    it("should return every requested user when all ids exist", async () => {
      await userRepository.save(
        buildUser({
          id: buildEntityId(FIRST_ID),
          email: "first@example.com",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      await userRepository.save(
        buildUser({
          id: buildEntityId(SECOND_ID),
          email: "second@example.com",
          cpf: buildUniqueCpf("234567890"),
        })
      )
      const useCase = new ListUsersByIdsUseCase(userRepository)

      const response = await useCase.execute({
        userIds: [FIRST_ID, SECOND_ID],
      })

      expect(response).toHaveLength(2)
    })

    it("should order the users like the requested ids when the storage order differs", async () => {
      await userRepository.save(
        buildUser({
          id: buildEntityId(SECOND_ID),
          email: "second@example.com",
          cpf: buildUniqueCpf("234567890"),
        })
      )
      await userRepository.save(
        buildUser({
          id: buildEntityId(FIRST_ID),
          email: "first@example.com",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new ListUsersByIdsUseCase(userRepository)

      const response = await useCase.execute({
        userIds: [FIRST_ID, SECOND_ID],
      })

      expect(response.map((row) => row.id)).toEqual([
        FIRST_ID,
        SECOND_ID,
      ])
    })

    it("should return only the existing users when an id has no row", async () => {
      await userRepository.save(
        buildUser({
          id: buildEntityId(FIRST_ID),
          email: "first@example.com",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new ListUsersByIdsUseCase(userRepository)

      const response = await useCase.execute({
        userIds: [FIRST_ID, MISSING_ID],
      })

      expect(response).toHaveLength(1)
      expect(response[0]!.id).toBe(FIRST_ID)
    })

    it("should return an empty list when the id list is empty", async () => {
      await userRepository.save(
        buildUser({
          id: buildEntityId(FIRST_ID),
          email: "first@example.com",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new ListUsersByIdsUseCase(userRepository)

      const response = await useCase.execute({ userIds: [] })

      expect(response).toEqual([])
    })

    it("should return an empty list when no requested id exists", async () => {
      await userRepository.save(
        buildUser({
          id: buildEntityId(FIRST_ID),
          email: "first@example.com",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new ListUsersByIdsUseCase(userRepository)

      const response = await useCase.execute({
        userIds: [MISSING_ID],
      })

      expect(response).toEqual([])
    })
  })
})
