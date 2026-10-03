import { describe, it, expect, beforeEach } from "vitest"

import { GetUserUseCase } from "@/services/user/use-cases/get-user.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeUserRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildUniqueCpf,
  buildUser,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/user/use-cases/get-user.use-case", () => {
  let userRepository: ReturnType<typeof createFakeUserRepository>

  beforeEach(() => {
    userRepository = createFakeUserRepository()
  })

  describe("execute", () => {
    it("should return the mapped user when the row exists", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(ID),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          cpf: buildUniqueCpf("123456789"),
          role: "MANAGER",
          image: "https://cdn.test/avatar.png",
          createdAt: new Date("2026-01-02T10:00:00.000Z"),
          updatedAt: new Date("2026-01-03T10:00:00.000Z"),
        })
      )
      const useCase = new GetUserUseCase(userRepository)

      const response = await useCase.execute({
        userId: saved.id!,
      })

      expect(response.id).toBe(ID)
      expect(response.name).toBe("Maria Silva")
      expect(response.email).toBe("maria@example.com")
      expect(response.role).toBe("MANAGER")
      expect(response.image).toBe("https://cdn.test/avatar.png")
      expect(response.createdAt).toBe("2026-01-02T10:00:00.000Z")
      expect(response.updatedAt).toBe("2026-01-03T10:00:00.000Z")
    })

    it("should expose a null image when the user has no picture", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(ID),
          cpf: buildUniqueCpf("123456789"),
          image: null,
        })
      )
      const useCase = new GetUserUseCase(userRepository)

      const response = await useCase.execute({
        userId: saved.id!,
      })

      expect(response.image).toBeNull()
    })

    it("should throw NotFoundError when the row does not exist", async () => {
      const useCase = new GetUserUseCase(userRepository)

      await expect(
        useCase.execute({ userId: ID })
      ).rejects.toThrow(NotFoundError)
    })
  })
})
