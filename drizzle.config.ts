import "dotenv/config"
import { defineConfig } from "drizzle-kit"

// Use a dummy URL during build if DATABASE_URL is not set (e.g., Vercel build)
// Drizzle Kit only needs a valid URL format for config validation; actual connection happens at runtime.
const databaseUrl = process.env.DATABASE_URL ?? "postgresql://dummy:dummy@localhost:5432/dummy"

export default defineConfig({
  out: "./drizzle",
  schema: "./database/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
})
