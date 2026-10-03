import { describe, it, expect, beforeEach } from "vitest"

import { DeleteUserUseCase } from "@/services/user/use-cases/delete-user.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeUserRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildUniqueCpf,
  buildUser,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/user/use-cases/delete-user.use-case", () => {
  let userRepository: ReturnType<typeof createFakeUserRepository>

  beforeEach(() => {
    userRepository = createFakeUserRepository()
  })

  describe("execute", () => {
    it("should remove the row when the user exists", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(ID),
          email: "target@example.com",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new DeleteUserUseCase(userRepository)

      await useCase.execute({ userId: saved.id! })

      expect(await userRepository.findById(saved.id!)).toBeNull()
    })

    it("should throw NotFoundError when the user does not exist", async () => {
      const useCase = new DeleteUserUseCase(userRepository)

      await expect(
        useCase.execute({ userId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should leave the other rows untouched when the user exists", async () => {
      const target = await userRepository.save(
        buildUser({
          id: buildEntityId(ID),
          email: "target@example.com",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const other = await userRepository.save(
        buildUser({
          email: "other@example.com",
          cpf: buildUniqueCpf("234567890"),
        })
      )
      const useCase = new DeleteUserUseCase(userRepository)

      await useCase.execute({ userId: target.id! })

      expect(
        await userRepository.findById(other.id!)
      ).not.toBeNull()
    })
  })
})
