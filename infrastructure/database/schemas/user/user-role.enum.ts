import { pgSchema } from "drizzle-orm/pg-core";

/**
 * Declares the `user_role` enum within the `user` database schema.
 *
 * The enum defines the roles a user can hold on the platform.
 */
export const userRole = pgSchema("user").enum("user_role", ["USER", "MANAGER"]);
