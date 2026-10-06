import type { UserIdentity } from "@/presentation/types/user-identity.types"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

/**
 * @summary
 * Projects a user read model onto the fields that name them.
 *
 * @remarks
 * Keeps the three fields the chrome renders and drops every
 * other: `id`, `name`, `cpf`, `email`, `role`,
 * `emailVerified` and `createdAt`. A name reaching the
 * sidebar or a detail summary should not take the account
 * behind it along.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so the layout and the
 * parts never import a DTO.
 *
 * @param dto - The user read model.
 *
 * @returns The identity of the user.
 *
 * @example
 * const IDENTITY = ToUserIdentity(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export function ToUserIdentity(
  dto: UserResponseDTO
): UserIdentity {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    image: dto.image,
  }
}
