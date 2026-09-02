import type { Verification } from "@/business/entities/user/verification.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `Verification` entities.
 *
 * An `IVerification`:
 * - persists verifications through {@link IVerification.save}.
 * - retrieves verifications by id and identifier.
 * - removes verifications by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Verification` entities and back.
 */
export interface IVerification {
  /**
   * Retrieves the verification with the provided id.
   *
   * @param id - The unique identifier of the verification.
   * @returns A promise resolving to the `Verification` or `null` when
   * not found.
   */
  findById(id: EntityId): Promise<Verification | null>;

  /**
   * Retrieves all verifications tied to the provided identifier.
   *
   * @param identifier - The identifier the verifications are tied to.
   * @returns A promise resolving to all matching `Verification` entities.
   */
  findAllByIdentifier(identifier: string): Promise<Verification[]>;

  /**
   * Persists the provided verification.
   *
   * When the verification has no id, the implementation inserts a
   * new record and the persisted `Verification` (with its generated
   * id) is returned; otherwise the existing record is updated.
   *
   * @param verification - The verification to persist.
   * @returns A promise resolving to the persisted `Verification`.
   */
  save(verification: Verification): Promise<Verification>;

  /**
   * Removes the verification with the provided id.
   *
   * @param id - The unique identifier of the verification.
   * @returns A promise that resolves when the verification is removed.
   */
  delete(id: EntityId): Promise<void>;
}
