import { vi } from "vitest"
import "dotenv/config"

// Load test env first
import "./_load-test-env.setup"

// Global test config
vi.setConfig({
  testTimeout: 30_000,
  hookTimeout: 60_000,
})

// Suppress console.log in tests unless DEBUG=1
if (!process.env.DEBUG) {
  global.console.log = vi.fn()
  global.console.info = vi.fn()
  global.console.warn = vi.fn()
}

// Ensure no test reads DATABASE_URL directly
const originalEnv = { ...process.env }
beforeEach(() => {
  process.env = { ...originalEnv }
  delete process.env.DATABASE_URL // force TEST_DATABASE_URL usage
})
afterEach(() => {
  process.env = { ...originalEnv }
})
