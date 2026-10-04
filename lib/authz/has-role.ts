import type { UserRole } from "@/lib/auth/user-role"

export function HasRole(
  userRole: UserRole,
  allowed: readonly UserRole[]
): boolean {
  return allowed.includes(userRole)
}

export function IsManager(userRole: UserRole): boolean {
  return userRole === "MANAGER"
}

export function IsUser(userRole: UserRole): boolean {
  return userRole === "USER"
}
