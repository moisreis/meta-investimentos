import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"

// Drizzle database instance connected via Neon HTTP driver.
// Uses DATABASE_URL from environment variables.
export const db = drizzle(process.env.DATABASE_URL!)