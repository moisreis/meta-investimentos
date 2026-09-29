import type { UserRow } from "@/presentation/types/user-row.types"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

/**
 * @summary
 * Projects a user read model onto the user row.
 *
 * @remarks
 * Keeps the 9 fields the screens render
 * and drops 3 that stay in the
 * service layer:
 * `cpf`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The user read model.
 *
 * @returns The user row.
 *
 * @example
 * const ROW = ToUserRow(DTO);
 *
 * @author MoisAcs Reis
 *
 * @date 2026-09-26
 */
export function ToUserRow(dto: UserResponseDTO): UserRow {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    maskedCpf: dto.maskedCpf,
    cpf: dto.cpf,
    role: dto.role,
    emailVerified: dto.emailVerified,
    image: dto.image,
    createdAt: dto.createdAt,
  }
}

/**
 * @summary
 * Projects the user read models onto the user rows.
 *
 * @remarks
 * Keeps the 9 fields the screens render
 * and drops 3 that stay in the
 * service layer:
 * `cpf`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The user read models.
 *
 * @returns The user rows.
 *
 * @example
 * const ROWS = ToUserRows(DTO);
 *
 * @author MoisAcs Reis
 *
 * @date 2026-09-26
 */
export function ToUserRows(dtos: UserResponseDTO[]): UserRow[] {
  return dtos.map(ToUserRow)
}
