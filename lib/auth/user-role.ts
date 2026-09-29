/**
 * @summary
 * Role a user can hold on the platform.
 *
 * @remarks
 * Either USER or MANAGER.
 *
 * @explanation
 * Use this type for role-based access control. It is the
 * single declaration shared by the domain, the service layer
 * and the presentation layer, so the three never drift.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export type UserRole = "USER" | "MANAGER"
