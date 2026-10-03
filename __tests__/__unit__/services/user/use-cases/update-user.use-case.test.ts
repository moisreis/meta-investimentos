import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { UpdateUserUseCase } from "@/services/user/use-cases/update-user.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeUserRepository } from "__tests__/__setup__/_fakes.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"
import {
  buildEntityId,
  buildUniqueCpf,
  buildUser,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/user/use-cases/update-user.use-case", () => {
  let userRepository: ReturnType<typeof createFakeUserRepository>

  beforeEach(() => {
    useFixedClock()
    userRepository = createFakeUserRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should return the updated name when the payload carries one", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(ID),
          name: "Maria Silva",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new UpdateUserUseCase(userRepository)

      const response = await useCase.execute({
        userId: saved.id!,
        name: "Maria Souza",
      })

      expect(response.name).toBe("Maria Souza")
    })

    it("should persist the updated fields when the payload carries them", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(ID),
          name: "Maria Silva",
          firstName: "Maria",
          lastName: "Silva",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new UpdateUserUseCase(userRepository)

      await useCase.execute({
        userId: saved.id!,
        firstName: "Mariana",
        lastName: "Souza",
      })

      const stored = await userRepository.findById(saved.id!)

      expect(stored!.firstName).toBe("Mariana")
      expect(stored!.lastName).toBe("Souza")
    })

    it("should keep the untouched fields when the payload omits them", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(ID),
          name: "Maria Silva",
          firstName: "Maria",
          lastName: "Silva",
          cpf: buildUniqueCpf("123456789"),
          image: "https://cdn.test/avatar.png",
        })
      )
      const useCase = new UpdateUserUseCase(userRepository)

      const response = await useCase.execute({
        userId: saved.id!,
        name: "Maria Souza",
      })

      expect(response.firstName).toBe("Maria")
      expect(response.lastName).toBe("Silva")
      expect(response.image).toBe("https://cdn.test/avatar.png")
    })

    it("should clear the image when the payload carries null", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(ID),
          cpf: buildUniqueCpf("123456789"),
          image: "https://cdn.test/avatar.png",
        })
      )
      const useCase = new UpdateUserUseCase(userRepository)

      const response = await useCase.execute({
        userId: saved.id!,
        image: null,
      })

      expect(response.image).toBeNull()
    })

    it("should refresh the update timestamp when the user exists", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(ID),
          cpf: buildUniqueCpf("123456789"),
          createdAt: new Date("2026-01-10T00:00:00.000Z"),
          updatedAt: new Date("2026-01-10T00:00:00.000Z"),
        })
      )
      const useCase = new UpdateUserUseCase(userRepository)

      const response = await useCase.execute({
        userId: saved.id!,
        name: "Maria Souza",
      })

      expect(response.updatedAt).toBe(
        getFixedDate().toISOString()
      )
      expect(response.createdAt).toBe("2026-01-10T00:00:00.000Z")
    })

    it("should throw NotFoundError when the user does not exist", async () => {
      const useCase = new UpdateUserUseCase(userRepository)

      await expect(
        useCase.execute({ userId: ID, name: "Maria Souza" })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the new name is blank", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(ID),
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new UpdateUserUseCase(userRepository)

      await expect(
        useCase.execute({ userId: saved.id!, name: "   " })
      ).rejects.toThrow(ValidationError)
    })

    it("should keep the stored name when the payload carries a blank name", async () => {
      const saved = await userRepository.save(
        buildUser({
          id: buildEntityId(ID),
          name: "Maria Silva",
          cpf: buildUniqueCpf("123456789"),
        })
      )
      const useCase = new UpdateUserUseCase(userRepository)

      await expect(
        useCase.execute({ userId: saved.id!, name: "   " })
      ).rejects.toThrow(ValidationError)

      const stored = await userRepository.findById(saved.id!)

      expect(stored!.name).toBe("Maria Silva")
    })
  })
})
