import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"

// Drizzle database instance connected via Neon HTTP driver.
// Uses DATABASE_URL from environment variables.
// Lazy initialization to avoid build-time errors when DATABASE_URL is not available.
let _db: ReturnType<typeof drizzle> | null = null

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop, receiver) {
    if (!_db) {
      const url = process.env.DATABASE_URL
      if (!url) {
        throw new Error(
          "DATABASE_URL is not set. Please configure it in your environment variables."
        )
      }
      _db = drizzle(url)
    }
    return Reflect.get(_db, prop, receiver)
  },
})
