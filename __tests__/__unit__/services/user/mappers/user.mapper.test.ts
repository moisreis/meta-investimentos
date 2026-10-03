import { describe, it, expect } from "vitest"

import { User } from "@/domain/user/entities/user.entity"
import {
  toCreateUserProps,
  toResponseDTO,
} from "@/services/user/mappers/user.mapper"
import {
  buildUser,
  buildEntityId,
  buildCpf,
  buildUniqueCpf,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000080"

describe("services/user/mappers/user.mapper", () => {
  describe("toCreateUserProps", () => {
    it("should carry the name of the payload when mapping a create DTO", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
      })

      expect(props.name).toBe("Maria Silva")
    })

    it("should carry the email of the payload when mapping a create DTO", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
      })

      expect(props.email).toBe("maria@example.com")
    })

    it("should carry the first name of the payload when mapping a create DTO", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
      })

      expect(props.firstName).toBe("Maria")
    })

    it("should carry the last name of the payload when mapping a create DTO", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
      })

      expect(props.lastName).toBe("Silva")
    })

    it("should parse the cpf into a CPF when mapping a create DTO", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
      })

      expect(props.cpf.value).toBe("52998224725")
    })

    it("should strip the cpf punctuation when mapping a formatted create DTO", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "529.982.247-25",
      })

      expect(props.cpf.value).toBe("52998224725")
    })

    it("should carry the manager role when the payload declares it", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
        role: "MANAGER",
      })

      expect(props.role).toBe("MANAGER")
    })

    it("should carry the user role when the payload declares it", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
        role: "USER",
      })

      expect(props.role).toBe("USER")
    })

    it("should leave the role undefined when the payload omits it", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
      })

      expect(props.role).toBeUndefined()
    })

    it("should carry the image url when the payload declares one", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
        image: "https://cdn.test/avatar.png",
      })

      expect(props.image).toBe("https://cdn.test/avatar.png")
    })

    it("should carry a null image when the payload clears the picture", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
        image: null,
      })

      expect(props.image).toBeNull()
    })

    it("should leave the image undefined when the payload omits it", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
      })

      expect(props.image).toBeUndefined()
    })

    it("should produce props accepted by User.create when mapping a create DTO", () => {
      const props = toCreateUserProps({
        name: "Maria Silva",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        cpf: "52998224725",
        role: "MANAGER",
        image: "https://cdn.test/avatar.png",
      })

      expect(() => User.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a user", () => {
      const user = buildUser({ id: buildEntityId(ID) })

      const response = toResponseDTO(user)

      expect(response.id).toBe(ID)
    })

    it("should carry the name when serializing a user", () => {
      const user = buildUser({ name: "Maria Silva" })

      const response = toResponseDTO(user)

      expect(response.name).toBe("Maria Silva")
    })

    it("should carry the email when serializing a user", () => {
      const user = buildUser({ email: "maria@example.com" })

      const response = toResponseDTO(user)

      expect(response.email).toBe("maria@example.com")
    })

    it("should carry the first name when serializing a user", () => {
      const user = buildUser({ firstName: "Maria" })

      const response = toResponseDTO(user)

      expect(response.firstName).toBe("Maria")
    })

    it("should carry the last name when serializing a user", () => {
      const user = buildUser({ lastName: "Silva" })

      const response = toResponseDTO(user)

      expect(response.lastName).toBe("Silva")
    })

    it("should expose the cpf digits as a string when serializing a user", () => {
      const user = buildUser({ cpf: buildCpf("52998224725") })

      const response = toResponseDTO(user)

      expect(response.cpf).toBe("52998224725")
    })

    it("should expose the masked cpf when serializing a user", () => {
      const user = buildUser({ cpf: buildCpf("52998224725") })

      const response = toResponseDTO(user)

      expect(response.maskedCpf).toBe("529.***.***-25")
    })

    it("should expose the masked cpf of another cpf when serializing a user", () => {
      const user = buildUser({
        cpf: buildUniqueCpf("123456789"),
      })

      const response = toResponseDTO(user)

      expect(response.maskedCpf).toBe("123.***.***-09")
    })

    it("should expose the manager role when serializing a manager", () => {
      const user = buildUser({ role: "MANAGER" })

      const response = toResponseDTO(user)

      expect(response.role).toBe("MANAGER")
    })

    it("should expose the user role when serializing a regular user", () => {
      const user = buildUser({ role: "USER" })

      const response = toResponseDTO(user)

      expect(response.role).toBe("USER")
    })

    it("should expose a verified email when the user verified it", () => {
      const user = buildUser({ emailVerified: true })

      const response = toResponseDTO(user)

      expect(response.emailVerified).toBe(true)
    })

    it("should expose an unverified email when the user did not verify it", () => {
      const user = buildUser({ emailVerified: false })

      const response = toResponseDTO(user)

      expect(response.emailVerified).toBe(false)
    })

    it("should expose a null image when the user has no picture", () => {
      const user = buildUser({ image: null })

      const response = toResponseDTO(user)

      expect(response.image).toBeNull()
    })

    it("should carry the image url when the user has a picture", () => {
      const user = buildUser({
        image: "https://cdn.test/avatar.png",
      })

      const response = toResponseDTO(user)

      expect(response.image).toBe("https://cdn.test/avatar.png")
    })

    it("should expose the timestamps as ISO 8601 strings when serializing a user", () => {
      const user = buildUser({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(user)

      expect(response.createdAt).toBe("2026-01-01T00:00:00.000Z")
      expect(response.updatedAt).toBe("2026-02-15T12:00:00.000Z")
    })
  })
})
