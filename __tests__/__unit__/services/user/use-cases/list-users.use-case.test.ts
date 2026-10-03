import { describe, it, expect, beforeEach } from "vitest"

import { ListUsersUseCase } from "@/services/user/use-cases/list-users.use-case"
import { createFakeUserRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildUniqueCpf,
  buildUser,
} from "__tests__/__setup__/_factories.setup"

const BASES = ["123456789", "234567890", "345678901"]

describe("services/user/use-cases/list-users.use-case", () => {
  let userRepository: ReturnType<typeof createFakeUserRepository>

  beforeEach(() => {
    userRepository = createFakeUserRepository()
  })

  describe("execute", () => {
    it("should return every row when no pagination is given", async () => {
      await userRepository.save(
        buildUser({
          id: buildEntityId(
            "00000000-0000-0000-0000-000000000051"
          ),
          email: "first@example.com",
          cpf: buildUniqueCpf("123456789"),
          createdAt: new Date("2026-01-10T00:00:00.000Z"),
        })
      )
      await userRepository.save(
        buildUser({
          id: buildEntityId(
            "00000000-0000-0000-0000-000000000052"
          ),
          email: "second@example.com",
          cpf: buildUniqueCpf("234567890"),
          createdAt: new Date("2026-01-20T00:00:00.000Z"),
        })
      )
      const useCase = new ListUsersUseCase(userRepository)

      const response = await useCase.execute({})

      expect(response).toHaveLength(2)
    })

    it("should order the rows by ascending creation date when no pagination is given", async () => {
      await userRepository.save(
        buildUser({
          id: buildEntityId(
            "00000000-0000-0000-0000-000000000052"
          ),
          email: "second@example.com",
          cpf: buildUniqueCpf("234567890"),
          createdAt: new Date("2026-01-20T00:00:00.000Z"),
        })
      )
      await userRepository.save(
        buildUser({
          id: buildEntityId(
            "00000000-0000-0000-0000-000000000051"
          ),
          email: "first@example.com",
          cpf: buildUniqueCpf("123456789"),
          createdAt: new Date("2026-01-10T00:00:00.000Z"),
        })
      )
      const useCase = new ListUsersUseCase(userRepository)

      const response = await useCase.execute({})

      expect(response.map((row) => row.email)).toEqual([
        "first@example.com",
        "second@example.com",
      ])
    })

    it("should return only the requested window when a limit is given", async () => {
      for (const INDEX of [1, 2, 3]) {
        await userRepository.save(
          buildUser({
            id: buildEntityId(
              `00000000-0000-0000-0000-00000000005${INDEX}`
            ),
            email: `user${INDEX}@example.com`,
            cpf: buildUniqueCpf(BASES[INDEX - 1]!),
            createdAt: new Date(
              `2026-01-0${INDEX}T00:00:00.000Z`
            ),
          })
        )
      }
      const useCase = new ListUsersUseCase(userRepository)

      const response = await useCase.execute({ limit: 2 })

      expect(response).toHaveLength(2)
    })

    it("should skip the first rows when an offset is given", async () => {
      for (const INDEX of [1, 2, 3]) {
        await userRepository.save(
          buildUser({
            id: buildEntityId(
              `00000000-0000-0000-0000-00000000005${INDEX}`
            ),
            email: `user${INDEX}@example.com`,
            cpf: buildUniqueCpf(BASES[INDEX - 1]!),
            createdAt: new Date(
              `2026-01-0${INDEX}T00:00:00.000Z`
            ),
          })
        )
      }
      const useCase = new ListUsersUseCase(userRepository)

      const response = await useCase.execute({
        limit: 2,
        offset: 2,
      })

      expect(response).toHaveLength(1)
      expect(response[0]!.email).toBe("user3@example.com")
    })

    it("should return an empty list when no row exists", async () => {
      const useCase = new ListUsersUseCase(userRepository)

      const response = await useCase.execute({})

      expect(response).toEqual([])
    })
  })
})
