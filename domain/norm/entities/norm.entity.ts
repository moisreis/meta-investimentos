import { EntityId, type SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface NormProps {
  articleNumber: string
  name: string
  categoryId: EntityId
  minAllocation: SignedPercentage
  maxAllocation: SignedPercentage
  targetAllocation: SignedPercentage
  version?: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * @summary
 * Represents a regulatory norm that constrains allocations.
 *
 * @remarks
 * Must have articleNumber, name, categoryId, and
 * min/max/target allocation percentages.
 * Instances are immutable after creation.
 *
 * @explanation
 * Defines regulatory limits for portfolio allocations.
 * Supports updates with validation.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Norm {
  private readonly _id?: EntityId
  private readonly props: Required<NormProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the norm.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare norms.
   *
   * @returns EntityId or undefined.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get id(): EntityId | undefined {
    return this._id
  }

  /**
   * @summary
   * Returns the article number of the norm.
   *
   * @remarks
   * Regulatory article identifier.
   *
   * @explanation
   * Refers to the legal article that defines the norm.
   *
   * @returns Article number string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get articleNumber(): string {
    return this.props.articleNumber
  }

  /**
   * @summary
   * Returns the name of the norm.
   *
   * @remarks
   * Descriptive name.
   *
   * @explanation
   * Human-readable name shown in lists and reports.
   *
   * @returns Name string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get name(): string {
    return this.props.name
  }

  /**
   * @summary
   * Returns the category ID of the norm.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Applies the norm to a specific fund category.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get categoryId(): EntityId {
    return this.props.categoryId
  }

  /**
   * @summary
   * Returns the minimum allocation of the norm.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Lower bound used for allocation compliance checks.
   *
   * @returns SignedPercentage.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get minAllocation(): SignedPercentage {
    return this.props.minAllocation
  }

  /**
   * @summary
   * Returns the maximum allocation of the norm.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Upper bound used for allocation compliance checks.
   *
   * @returns SignedPercentage.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get maxAllocation(): SignedPercentage {
    return this.props.maxAllocation
  }

  /**
   * @summary
   * Returns the target allocation of the norm.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Desired value used for allocation compliance checks.
   *
   * @returns SignedPercentage.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get targetAllocation(): SignedPercentage {
    return this.props.targetAllocation
  }

  /**
   * @summary
   * Returns the optimistic-locking version of the norm.
   *
   * @remarks
   * Required number, defaults to zero.
   *
   * @explanation
   * Use to guard concurrent updates in the repository.
   *
   * @returns Current version number.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  get version(): number {
    return this.props.version
  }

  /**
   * @summary
   * Returns the creation timestamp of the norm.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Orders records and supports audit trails.
   *
   * @returns Creation Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get createdAt(): Date {
    return new Date(this.props.createdAt)
  }

  /**
   * @summary
   * Returns the last update timestamp of the norm.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Shows when the norm last changed.
   *
   * @returns Last update Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get updatedAt(): Date {
    return new Date(this.props.updatedAt)
  }

  // ---------------------------------
  // CONSTRUCTION
  // ---------------------------------

  /**
   * @summary
   * Creates a Norm instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Norm.create instead.
   *
   * @param props - Required norm properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<NormProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    })
  }

  // ---------------------------------
  // FACTORY
  // ---------------------------------

  /**
   * @summary
   * Creates a valid Norm from the provided properties.
   *
   * @remarks
   * Validates all fields and enforces min <= target <= max.
   * Timestamps default to current time.
   *
   * @explanation
   * Factory method to construct a valid Norm.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the norm.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Norm.
   *
   * @example
   * const NORM = Norm.create({
   *   articleNumber: "Art. 12",
   *   name: "Limite de Concentração",
   *   categoryId: EntityId.create(
   *     "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"
   *   ),
   *   minAllocation: SignedPercentage.create("5"),
   *   maxAllocation: SignedPercentage.create("20"),
   *   targetAllocation: SignedPercentage.create("12"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: NormProps, id?: string): Norm {
    if (!props.articleNumber || props.articleNumber.trim() === "") {
      throw new ValidationError("`Norm` must have an article number.")
    }
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("`Norm` must have a name.")
    }
    if (!props.categoryId || props.categoryId.trim() === "") {
      throw new ValidationError("`Norm` must have a category id.")
    }
    if (!props.minAllocation) {
      throw new ValidationError("`Norm` must have a minimum allocation.")
    }
    if (!props.maxAllocation) {
      throw new ValidationError("`Norm` must have a maximum allocation.")
    }
    if (!props.targetAllocation) {
      throw new ValidationError("`Norm` must have a target allocation.")
    }
    if (props.minAllocation.value.gt(props.targetAllocation.value)) {
      throw new ValidationError(
        "`Norm` minimum allocation must not exceed target allocation."
      )
    }
    if (props.targetAllocation.value.gt(props.maxAllocation.value)) {
      throw new ValidationError(
        "`Norm` target allocation must not exceed maximum allocation."
      )
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<NormProps> = {
      ...props,
      version: props.version ?? 0,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    }

    return new Norm(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // MUTATIONS
  // ---------------------------------

  /**
   * @summary
   * Updates the mutable fields of this norm.
   *
   * @remarks
   * Only provided fields changed; ordering re-validated.
   *
   * @explanation
   * Returns new Norm instance with updated fields.
   * Original unchanged.
   *
   * @param options - Fields to update.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns Updated Norm.
   *
   * @example
   * const UPDATED = norm.update({
   *   name: "Novo Limite",
   *   minAllocation: SignedPercentage.create("3"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public update(
    options: {
      articleNumber?: string
      name?: string
      categoryId?: EntityId
      minAllocation?: SignedPercentage
      maxAllocation?: SignedPercentage
      targetAllocation?: SignedPercentage
    },
    now?: Date
  ): Norm {
    const ARTICLE_NUMBER = options.articleNumber ?? this.props.articleNumber
    const NAME = options.name ?? this.props.name
    const CATEGORY_ID = options.categoryId ?? this.props.categoryId
    const MIN = options.minAllocation ?? this.props.minAllocation
    const MAX = options.maxAllocation ?? this.props.maxAllocation
    const TARGET = options.targetAllocation ?? this.props.targetAllocation

    if (!ARTICLE_NUMBER || ARTICLE_NUMBER.trim() === "") {
      throw new ValidationError("`Norm` must have an article number.")
    }
    if (!NAME || NAME.trim() === "") {
      throw new ValidationError("`Norm` must have a name.")
    }
    if (!CATEGORY_ID || CATEGORY_ID.trim() === "") {
      throw new ValidationError("`Norm` must have a category id.")
    }
    if (!MIN) {
      throw new ValidationError("`Norm` must have a minimum allocation.")
    }
    if (!MAX) {
      throw new ValidationError("`Norm` must have a maximum allocation.")
    }
    if (!TARGET) {
      throw new ValidationError("`Norm` must have a target allocation.")
    }
    if (MIN.value.gt(TARGET.value)) {
      throw new ValidationError(
        "`Norm` minimum allocation must not exceed target allocation."
      )
    }
    if (TARGET.value.gt(MAX.value)) {
      throw new ValidationError(
        "`Norm` target allocation must not exceed maximum allocation."
      )
    }

    const NOW = now ?? new Date()

    return new Norm(
      {
        ...this.props,
        articleNumber: ARTICLE_NUMBER,
        name: NAME,
        categoryId: CATEGORY_ID,
        minAllocation: MIN,
        maxAllocation: MAX,
        targetAllocation: TARGET,
        updatedAt: NOW,
      },
      this._id
    )
  }

  // ---------------------------------
  // COMPARISON
  // ---------------------------------

  /**
   * @summary
   * Compares this Norm with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two norms by their persisted identity.
   *
   * @param object - The Norm to compare against.
   *
   * @returns True when both IDs match.
   *
   * @example
   * const A = Norm.create(PROPS, ID);
   * const B = Norm.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Norm | null): boolean {
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
