import { EntityId, type SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface FundUpdatedProps {
  fundId: EntityId
  name?: string | undefined
  administrationFee?: SignedPercentage | null | undefined
  performanceFee?: SignedPercentage | null | undefined
  benchmarkId?: EntityId | null | undefined
  categoryId?: EntityId | null | undefined
  occurredAt?: Date
}

type RequiredProps = {
  fundId: EntityId
  name: string | undefined
  administrationFee: SignedPercentage | null | undefined
  performanceFee: SignedPercentage | null | undefined
  benchmarkId: EntityId | null | undefined
  categoryId: EntityId | null | undefined
  occurredAt: Date
}

/**
 * @summary
 * Updates the profile of an investment fund.
 *
 * @remarks
 * Emitted after the **Fund** profile is changed.
 * Carries only the fields that were updated.
 *
 * @explanation
 * Use this event to react to fund adjustments.
 * Optional fields identify which profile fields
 * were changed by the update.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export class FundUpdated {
  private readonly _id?: EntityId
  private readonly props: RequiredProps

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the updated fund.
  get fundId(): EntityId {
    return this.props.fundId
  }

  // Returns the new name, if changed.
  get name(): string | undefined {
    return this.props.name
  }

  // Returns the new administration fee, if changed.
  get administrationFee(): SignedPercentage | null | undefined {
    return this.props.administrationFee
  }

  // Returns the new performance fee, if changed.
  get performanceFee(): SignedPercentage | null | undefined {
    return this.props.performanceFee
  }

  // Returns the new benchmark, if changed.
  get benchmarkId(): EntityId | null | undefined {
    return this.props.benchmarkId
  }

  // Returns the new category, if changed.
  get categoryId(): EntityId | null | undefined {
    return this.props.categoryId
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(props: RequiredProps, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      occurredAt: new Date(props.occurredAt),
    })
  }

  /**
   * @summary
   * Creates a valid **FundUpdated** event.
   *
   * @remarks
   * Validates the fund identifier. Optional fields
   * default to undefined when not provided.
   *
   * @explanation
   * Factory method to build the event after the
   * **Fund** profile is changed. Throws a
   * **ValidationError** when the fund id is missing.
   *
   * @param props - Properties of the updated profile.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = FundUpdated.create({
   *   fundId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   name: "Fundo Multi Mercado II",
   *   administrationFee: SignedPercentage.create("1.2"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-30
   */
  public static create(
    props: FundUpdatedProps,
    id?: string
  ): FundUpdated {
    if (!props.fundId) {
      throw new ValidationError("`FundUpdated` needs a fund id.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      name: props.name,
      administrationFee: props.administrationFee,
      performanceFee: props.performanceFee,
      benchmarkId: props.benchmarkId,
      categoryId: props.categoryId,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new FundUpdated(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: FundUpdated | null): boolean {
    if (object == null || object === undefined) {
      return false
    }
    if (this === object) {
      return true
    }
    if (!this._id || !object._id) {
      return false
    }

    return this._id === object._id
  }
}
