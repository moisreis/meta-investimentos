import { Bank, type BankProps } from "@domain/bank/entities/bank.entity"
import type { CreateBankDTO } from "../dto/create-bank.dto"
import type { BankResponseDTO } from "../dto/bank-response.dto"

/**
 * @summary
 * Maps a create `Bank` DTO into entity props.
 *
 * @remarks
 * Code and name are plain strings already accepted
 * by the entity factory.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props for `Bank.create`.
 */
export function toCreateBankProps(dto: CreateBankDTO): BankProps {
  return {
    code: dto.code,
    name: dto.name,
  }
}

/**
 * @summary
 * Maps a `Bank` entity into a response DTO.
 *
 * @remarks
 * Serializes the id to a string and timestamps to
 * ISO 8601 strings.
 *
 * @param entity - The bank domain entity.
 * @returns Response DTO payload.
 */
export function toResponseDTO(entity: Bank): BankResponseDTO {
  return {
    id: entity.id as string,
    code: entity.code,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
