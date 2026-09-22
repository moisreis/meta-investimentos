import type { Verification } from "@domain/verification/entities/verification.entity"
import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the repository contract for `Verification` entities.
 *
 * @remarks
 * An `IVerification` persists, retrieves, and removes
 * verifications. Supports lookup by id and identifier.
 *
 * @explanation
 * Use this interface to implement data access for verifications.
 * Persistence implementations map rows to
 * `Verification` entities.
 *
 * @example
 * const VER = await VERIFICATION_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IVerification {
  /**
   * @summary
   * Retrieves the verification with the provided id.
   *
   * @remarks
   * Returns null when no verification matches.
   *
   * @explanation
   * Use this method to look up a single verification by
   * its unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the verification.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const VER = await VERIFICATION_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Verification | null>

  /**
   * @summary
   * Retrieves all verifications tied to the identifier.
   *
   * @remarks
   * Returns an empty array when no verifications match.
   *
   * @explanation
   * Use this method to list verifications linked to an
   * identifier. Returns an empty array for no matches.
   *
   * @param identifier - The identifier of the verifications.
   *
   * @returns The matching entries.
   *
   * @example
   * const VERS = await VERIFICATION_REPO
   *   .findAllByIdentifier(IDENTIFIER);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByIdentifier(identifier: string): Promise<Verification[]>

  /**
   * @summary
   * Retrieves all verifications tied to the identifiers.
   *
   * @remarks
   * Returns an empty array when no verifications match.
   *
   * @explanation
   * Use this method to list verifications linked to
   * several identifiers. Returns an empty array for no matches.
   *
   * @param identifiers - The identifiers of the verifications.
   *
   * @returns The matching entries.
   *
   * @example
   * const VERS = await VERIFICATION_REPO
   *   .findAllByIdentifiers(IDENTIFIERS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByIdentifiers(identifiers: string[]): Promise<Verification[]>

  /**
   * @summary
   * Persists the provided verification.
   *
   * @remarks
   * Inserts a new record when the verification has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a verification.
   * The persisted entity with its id is returned.
   *
   * @param verification - The verification to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const VER = await VERIFICATION_REPO.save(NEW_VER);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(verification: Verification): Promise<Verification>

  /**
   * @summary
   * Removes the verification with the provided id.
   *
   * @remarks
   * Resolves when the verification is removed.
   *
   * @explanation
   * Use this method to delete a verification record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the verification.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await VERIFICATION_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
