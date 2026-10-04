import type { UserRole } from "@/lib/auth/user-role"

export const ROLES = {
  USER: "USER",
  MANAGER: "MANAGER",
} as const satisfies Record<string, UserRole>

export type { UserRole }
