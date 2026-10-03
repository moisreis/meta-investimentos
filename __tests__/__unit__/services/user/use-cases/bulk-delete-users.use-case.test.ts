import { describe, it, expect, beforeEach } from "vitest"

import { BulkDeleteUsersUseCase } from "@/services/user/use-cases/bulk-delete-users.use-case"
import { createFakeUserRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildUniqueCpf,
  buildUser,
} from "__tests__/__setup__/_factories.setup"

const FIRST_ID = "00000000-0000-0000-0000-000000000051"
const SECOND_ID = "00000000-0000-0000-0000-000000000052"
const MISSING_ID = "00000000-0000-0000-0000-000000000059"

describe("services/user/use-cases/bulk-delete-users.use-case", () => {
  let userRepository: ReturnType<typeof createFakeUserRepository>

  beforeEach(() => {
    userRepository = createFakeUserRepository()
  })

  describe("execute", () => {
    it("should remove every requested row when the ids exist", async () => {
      const first = await userRepository.save(
        buildUser({
          id: buildEntityId(FIRST_ID),
          email: "first@example.com",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const second = await userRepository.save(
        buildUser({
          id: buildEntityId(SECOND_ID),
          email: "second@example.com",
          cpf: buildUniqueCpf("234567890"),
        })
      )
      const useCase = new BulkDeleteUsersUseCase(userRepository)

      await useCase.execute({ userIds: [FIRST_ID, SECOND_ID] })

      expect(
        await userRepository.findAllByIds([
          first.id!,
          second.id!,
        ])
      ).toHaveLength(0)
    })

    it("should keep every row when the id list is empty", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(FIRST_ID),
          email: "first@example.com",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new BulkDeleteUsersUseCase(userRepository)

      await useCase.execute({ userIds: [] })

      expect(
        await userRepository.findById(saved.id!)
      ).not.toBeNull()
    })

    it("should keep every row when no requested id exists", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(FIRST_ID),
          email: "first@example.com",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new BulkDeleteUsersUseCase(userRepository)

      await useCase.execute({ userIds: [MISSING_ID] })

      expect(
        await userRepository.findById(saved.id!)
      ).not.toBeNull()
    })

    it("should skip the missing ids when only some rows exist", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(FIRST_ID),
          email: "first@example.com",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new BulkDeleteUsersUseCase(userRepository)

      await useCase.execute({
        userIds: [FIRST_ID, MISSING_ID],
      })

      expect(await userRepository.findById(saved.id!)).toBeNull()
    })
  })
})
