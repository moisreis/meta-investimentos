import { config } from "dotenv"
import { resolve } from "path"

console.log(
  "[TEST SETUP] Loading .env.test from:",
  resolve(process.cwd(), ".env.test")
)

const result = config({
  path: resolve(process.cwd(), ".env.test"),
  override: true,
})

console.log("[TEST SETUP] Dotenv result:", result)
console.log(
  "[TEST SETUP] DATABASE_URL from .env.test:",
  process.env.DATABASE_URL
)

// Map DATABASE_URL from .env.test to TEST_DATABASE_URL for test safety
if (process.env.DATABASE_URL && !process.env.TEST_DATABASE_URL) {
  process.env.TEST_DATABASE_URL = process.env.DATABASE_URL
  console.log(
    "[TEST SETUP] Set TEST_DATABASE_URL from DATABASE_URL"
  )
}

// Clear production DATABASE_URL to prevent accidental usage
delete process.env.DATABASE_URL
console.log(
  "[TEST SETUP] Deleted DATABASE_URL, TEST_DATABASE_URL:",
  process.env.TEST_DATABASE_URL ? "SET" : "NOT SET"
)
