import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface CategoryProps {
  name: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * @summary
 * Represents an investment fund category.
 *
 * @remarks
 * Must have name. Instances immutable after creation.
 *
 * @explanation
 * Classifies funds for regulatory norms and reporting.
 * Supports renaming.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Category {
  private readonly _id?: EntityId
  private readonly props: Required<CategoryProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the category.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the identity used by the repository
   * and by `equals` to compare categories.
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
   * Returns the name of the category.
   *
   * @remarks
   * Required string.
   *
   * @explanation
   * Shown in classification lists and reports.
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
   * Returns the creation timestamp of the category.
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
   * Returns the last update timestamp of the category.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Shows when the category last changed.
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
   * Creates a Category instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Category.create instead.
   *
   * @param props - Required category properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(
    props: Required<CategoryProps>,
    id?: string
  ) {
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
   * Creates a valid Category from the provided properties.
   *
   * @remarks
   * Validates name. Timestamps default to current time.
   *
   * @explanation
   * Factory method to construct a valid Category.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the category.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Category instance.
   *
   * @example
   * const CATEGORY = Category.create({
   *   name: "Ações",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(
    props: CategoryProps,
    id?: string
  ): Category {
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("`Category` must have a name.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<CategoryProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    }

    return new Category(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // MUTATIONS
  // ---------------------------------

  /**
   * @summary
   * Renames this category.
   *
   * @remarks
   * Returns new Category instance with updated name.
   *
   * @explanation
   * Use to change category name.
   * Original instance unchanged.
   *
   * @param name - New category name.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns Updated category name.
   *
   * @example
   * const RENAMED = category.rename("Renda Fixa");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public rename(name: string, now?: Date): Category {
    if (!name || name.trim() === "") {
      throw new ValidationError("`Category` must have a name.")
    }

    const NOW = now ?? new Date()

    return new Category(
      {
        ...this.props,
        name,
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
   * Compares this Category with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two categories by their persisted identity.
   *
   * @param object - The Category to compare against.
   *
   * @returns True when both IDs match.
   *
   * @example
   * const A = Category.create(PROPS, ID);
   * const B = Category.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Category | null): boolean {
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
