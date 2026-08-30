/**
 * Represents the role assigned to a {@link User}.
 */
export type UserRole = "USER" | "MANAGER";

/**
 * Represents the properties required to create a {@link User}.
 *
 * The `role` defaults to `USER`, `emailVerified` defaults to `false`,
 * `image` defaults to `null`, and the timestamps default to the
 * current time when not provided.
 *
 * Use {@link User.create} to create a valid `User` instance.
 */
interface UserProps {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  cpf: string;
  role?: UserRole;
  emailVerified?: boolean;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents an application user.
 *
 * A `User`:
 * - must have a name.
 * - must have a valid email containing an `@`.
 * - must have a first name.
 * - must have a last name.
 * - must have a cpf.
 * - must have a valid {@link UserRole} when one is provided.
 *
 * `User` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const USER = User.create({
 *   name: 'José da Silva',
 *   email: 'jose@example.com',
 *   firstName: 'José',
 *   lastName: 'da Silva',
 *   cpf: '24301457030',
 * })
 *
 * USER.role
 * // 'USER'
 * ```
 *
 * @example
 * ```ts
 * const A = User.create(PROPS, 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2')
 * const B = User.create(PROPS, 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2')
 *
 * A.equals(B)
 * // true
 * ```
 */
export class User {
  private readonly _id?: string;
  private readonly props: Required<UserProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the user.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the full name of the user.
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * Returns the email of the user.
   */
  get email(): string {
    return this.props.email;
  }

  /**
   * Returns the first name of the user.
   */
  get firstName(): string {
    return this.props.firstName;
  }

  /**
   * Returns the last name of the user.
   */
  get lastName(): string {
    return this.props.lastName;
  }

  /**
   * Returns the cpf of the user.
   */
  get cpf(): string {
    return this.props.cpf;
  }

  /**
   * Returns the role of the user.
   */
  get role(): UserRole {
    return this.props.role;
  }

  /**
   * Returns whether the user's email was verified.
   */
  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  /**
   * Returns the profile image url of the user.
   */
  get image(): string | null {
    return this.props.image;
  }

  /**
   * Returns the creation timestamp of the user.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the user.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `User`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link User.create} and therefore satisfy the
   * user's invariants.
   */
  private constructor(props: Required<UserProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `User` from the provided properties.
   *
   * The `role` defaults to `USER`, `emailVerified` to `false`,
   * `image` to `null`, and the timestamps to the current time
   * when those properties are not provided.
   *
   * @param props - The properties required to create the user.
   * @param id - The unique identifier of the user.
   *
   * @returns A valid `User` instance.
   *
   * @throws {Error} If `props.name` is blank.
   * @throws {Error} If `props.email` does not contain an `@`.
   * @throws {Error} If `props.firstName` is blank.
   * @throws {Error} If `props.lastName` is blank.
   * @throws {Error} If `props.cpf` is blank.
   * @throws {Error} If `props.role` is not a valid {@link UserRole}.
   */
  public static create(props: UserProps, id?: string): User {
    if (!props.name || props.name.trim() === "") {
      throw new Error("User must have a name.");
    }
    if (!props.email || !props.email.includes("@")) {
      throw new Error("User must have a valid email.");
    }
    if (!props.firstName || props.firstName.trim() === "") {
      throw new Error("User must have a first name.");
    }
    if (!props.lastName || props.lastName.trim() === "") {
      throw new Error("User must have a last name.");
    }
    if (!props.cpf || props.cpf.trim() === "") {
      throw new Error("User must have a valid cpf.");
    }
    if (
      props.role !== undefined &&
      props.role !== "USER" &&
      props.role !== "MANAGER"
    ) {
      throw new Error("User must have a valid role.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<UserProps> = {
      ...props,
      role: props.role ?? "USER",
      emailVerified: props.emailVerified ?? false,
      image: props.image ?? null,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new User(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `User` represents the same user as the
   * provided instance, based on referential equality and the unique id.
   *
   * @param object - The user to compare against.
   * @returns `true` when both users share the same id; otherwise, `false`.
   *
   * @example
   * ```ts
   * const A = User.create(PROPS, ID)
   * const B = User.create(PROPS, ID)
   *
   * A.equals(B)
   * // true
   * ```
   */
  public equals(object?: User | null): boolean {
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
