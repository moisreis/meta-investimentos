import { pgSchema } from "drizzle-orm/pg-core"

// Declares the roles a user can hold on the platform.
// Provides the USER and MANAGER role values.
export const userRole = pgSchema("user").enum("user_role", ["USER", "MANAGER"])
