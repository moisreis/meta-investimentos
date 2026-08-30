/**
 * Represents the properties required to create a {@link Category}.
 *
 * The timestamps default to the current time when not provided.
 *
 * Use {@link Category.create} to create a valid `Category` instance.
 */
interface CategoryProps {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents an investment fund category.
 *
 * A `Category`:
 * - must have a name.
 *
 * `Category` instances are immutable after creation.
 */
export class Category {
  private readonly _id?: string;
  private readonly props: Required<CategoryProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the category.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the name of the category.
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * Returns the creation timestamp of the category.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the category.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `Category`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Category.create} and therefore satisfy
   * the category's invariants.
   */
  private constructor(props: Required<CategoryProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `Category` from the provided properties.
   *
   * The timestamps default to the current time when those properties
   * are not provided.
   *
   * @param props - The properties required to create the category.
   * @param id - The unique identifier of the category.
   *
   * @returns A valid `Category` instance.
   *
   * @throws {Error} If `props.name` is blank.
   */
  public static create(props: CategoryProps, id?: string): Category {
    if (!props.name || props.name.trim() === "") {
      throw new Error("Category must have a name.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<CategoryProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Category(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `Category` represents the same category
   * as the provided instance, based on referential equality and the
   * unique id.
   *
   * @param object - The category to compare against.
   * @returns `true` when both categories share the same id; otherwise, `false`.
   */
  public equals(object?: Category | null): boolean {
    if (object == null || object === undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!this._id || !object._id) {
      return false;
    }

    return this._id === object._id;
  }
}
