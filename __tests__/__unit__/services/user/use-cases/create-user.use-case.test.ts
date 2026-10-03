import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { CreateUserUseCase } from "@/services/user/use-cases/create-user.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakeUserRepository } from "__tests__/__setup__/_fakes.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const CPF = "52998224725"

describe("services/user/use-cases/create-user.use-case", () => {
  let userRepository: ReturnType<typeof createFakeUserRepository>

  beforeEach(() => {
    useFixedClock()
    userRepository = createFakeUserRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should persist the user built from the payload when the input is valid", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      const response = await useCase.execute({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: CPF,
      })

      expect(response.name).toBe("Maria Silva")
      expect(response.email).toBe("maria@example.com")
      expect(response.firstName).toBe("Maria")
      expect(response.lastName).toBe("Silva")
      expect(response.cpf).toBe(CPF)
      expect(response.id).toBeDefined()
    })

    it("should store exactly one row when creating a user", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      await useCase.execute({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: CPF,
      })

      const stored = await userRepository.findAll({})

      expect(stored).toHaveLength(1)
    })

    it("should default the role to USER when the payload omits it", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      const response = await useCase.execute({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: CPF,
      })

      expect(response.role).toBe("USER")
    })

    it("should keep the MANAGER role when the payload carries it", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      const response = await useCase.execute({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: CPF,
        role: "MANAGER",
      })

      expect(response.role).toBe("MANAGER")
    })

    it("should expose a null image when the payload omits it", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      const response = await useCase.execute({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: CPF,
      })

      expect(response.image).toBeNull()
    })

    it("should carry the image when the payload provides one", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      const response = await useCase.execute({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: CPF,
        image: "https://cdn.test/avatar.png",
      })

      expect(response.image).toBe("https://cdn.test/avatar.png")
    })

    it("should mask the cpf when creating a user", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      const response = await useCase.execute({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: CPF,
      })

      expect(response.maskedCpf).toBe("529.***.***-25")
    })

    it("should leave the email unverified when creating a user", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      const response = await useCase.execute({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: CPF,
      })

      expect(response.emailVerified).toBe(false)
    })

    it("should stamp the timestamps from the clock when creating a user", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      const response = await useCase.execute({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: CPF,
      })

      expect(response.createdAt).toBe(
        getFixedDate().toISOString()
      )
      expect(response.updatedAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw ValidationError when the email is invalid", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      await expect(
        useCase.execute({
          name: "Maria Silva",
          email: "not-an-email",
          firstName: "Maria",
          lastName: "Silva",
          cpf: CPF,
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should throw ValidationError when the cpf is invalid", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      await expect(
        useCase.execute({
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          cpf: "11111111111",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should store no row when the input is invalid", async () => {
      const useCase = new CreateUserUseCase(userRepository)

      await expect(
        useCase.execute({
          name: "   ",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          cpf: CPF,
        })
      ).rejects.toThrow(ValidationError)

      expect(await userRepository.findAll({})).toHaveLength(0)
    })
  })
})
