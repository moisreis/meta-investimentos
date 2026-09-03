import type { UserRole } from "@/business/entities/user/user.entity";
import type { CPF } from "@/business/value-objects/cpf.vo";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The public representation of a user returned by user use cases.
 */
export interface UserDto {
  id: EntityId;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  cpf: CPF;
  maskedCpf: string;
  role: UserRole;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The public representation of the currently authenticated actor.
 */
export interface CurrentActorDto {
  id: EntityId;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
