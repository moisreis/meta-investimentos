import type { CPF } from "@/business/value-objects/cpf.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the role assigned to a {@link User}.
 */
export type UserRole = "USER" | "MANAGER";

/**
 * Matches a valid email address.
 *
 * The pattern requires a local part, an `@` and a domain part that
 * contains at least one dot, so addresses without a domain suffix are
 * rejected.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  cpf: CPF;
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
 * - must have a valid email.
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
 *   name: 'JosÃ© da Silva',
 *   email: 'jose@example.com',
 *   firstName: 'JosÃ©',
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
  private readonly _id?: EntityId;
  private readonly props: Required<UserProps>;

  /**
   * Returns the unique identifier of the user.
   */
  get id(): EntityId | undefined {
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
  get cpf(): CPF {
    return this.props.cpf;
  }

  /**
   * Returns a masked representation of the user's cpf.
   *
   * Only the first three digits and the last two digits are shown; the
   * middle digits are replaced with asterisks.
   */
  get maskedCpf(): string {
    const VALUE = this.props.cpf.value;
    return `${VALUE.slice(0, 3)}.***.***-${VALUE.slice(-2)}`;
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

  /**
   * Creates a `User`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link User.create} and therefore satisfy the
   * user's invariants.
   */
  private constructor(props: Required<UserProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

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
   * @throws {ValidationError} If `props.name` is blank.
   * @throws {ValidationError} If `props.email` is not a valid email.
   * @throws {ValidationError} If `props.firstName` is blank.
   * @throws {ValidationError} If `props.lastName` is blank.
   * @throws {ValidationError} If `props.cpf` is blank.
   * @throws {ValidationError} If `props.role` is not a valid {@link UserRole}.
   */
  public static create(props: UserProps, id?: string): User {
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("User must have a name.");
    }
    if (!props.email || !EMAIL_PATTERN.test(props.email)) {
      throw new ValidationError("User must have a valid email.");
    }
    if (!props.firstName || props.firstName.trim() === "") {
      throw new ValidationError("User must have a first name.");
    }
    if (!props.lastName || props.lastName.trim() === "") {
      throw new ValidationError("User must have a last name.");
    }
    if (!props.cpf) {
      throw new ValidationError("User must have a valid cpf.");
    }
    if (
      props.role !== undefined &&
      props.role !== "USER" &&
      props.role !== "MANAGER"
    ) {
      throw new ValidationError("User must have a valid role.");
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
