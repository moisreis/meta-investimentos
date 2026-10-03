import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs"
import { relative, resolve, sep } from "node:path"

// The test tree root. Every test lives below it and the
// folder below it says which kind of test it is.
const TESTS_ROOT = "__tests__"

// The two halves of the suite. `__unit__` never touches the
// database, `__integration__` is the only place a repository
// is exercised for real.
const UNIT_ROOT = "__tests__/__unit__"
const INTEGRATION_ROOT = "__tests__/__integration__"

// The only place shared helpers live. A helper is prefixed so
// a glob for `*.test.ts` never picks it up as a suite.
const SETUP_ROOT = "__tests__/__setup__"

// How a production file maps to the test that must cover it.
// The rule name is what a violation is grouped under.
interface MirrorRule {
  rule: string
  from: RegExp
  to: string
}

const MIRROR_RULES: MirrorRule[] = [
  {
    rule: "domain-entity",
    from: /^domain\/(.+)\.entity\.ts$/,
    to: "__tests__/__unit__/domain/$1.entity.test.ts",
  },
  {
    rule: "domain-event",
    from: /^domain\/(.+)\.event\.ts$/,
    to: "__tests__/__unit__/domain/$1.event.test.ts",
  },
  {
    rule: "domain-calculator",
    from: /^domain\/(.+)\.calculator\.ts$/,
    to: "__tests__/__unit__/domain/$1.calculator.test.ts",
  },
  {
    rule: "infrastructure-mapper",
    from: /^infrastructure\/(.+)\.mapper\.ts$/,
    to: "__tests__/__unit__/infrastructure/$1.mapper.test.ts",
  },
  {
    rule: "infrastructure-repository",
    from: /^infrastructure\/(.+)\.repository\.ts$/,
    to: "__tests__/__integration__/infrastructure/$1.repository.test.ts",
  },
  {
    rule: "services-mapper",
    from: /^services\/(.+)\.mapper\.ts$/,
    to: "__tests__/__unit__/services/$1.mapper.test.ts",
  },
  {
    rule: "services-use-case",
    from: /^services\/(.+)\.use-case\.ts$/,
    to: "__tests__/__unit__/services/$1.use-case.test.ts",
  },
  {
    rule: "lib",
    from: /^lib\/(.+)\.ts$/,
    to: "__tests__/__unit__/lib/$1.test.ts",
  },
  {
    rule: "value-objects",
    from: /^value-objects\/(.+)\.vo\.ts$/,
    to: "__tests__/__unit__/value-objects/$1.vo.test.ts",
  },
]

// The roots the mirror rules read from.
const MIRRORED_ROOTS = [
  "domain",
  "infrastructure",
  "services",
  "lib",
  "value-objects",
]

// A unit suite fakes every repository, so it cannot prove a
// flow that spans more than one aggregate. The flows below
// compose real use cases over real repositories against the
// test database, and are listed here so the stray check
// accepts their second suite.
const INTEGRATION_FLOWS: string[] = [
  "services/application/use-cases/add-application.use-case",
  "services/portfolio-performance/use-cases/calculate-portfolio-performance.use-case",
  "services/quota/use-cases/import-fund-valuations.use-case",
  "services/withdrawal/use-cases/add-withdrawal.use-case",
]

// Directories that are not project source.
const SKIPPED_DIRECTORIES = [".git", ".next", "node_modules"]

// Production files with no runtime behaviour that do not need
// a mirrored test suite. These are pure type re-exports, schemas,
// or config that carry no executable logic.
const NO_TEST_NEEDED = new Set([
  "lib/auth/user-role.ts",
  "lib/money/money.validation.ts",
  "lib/quota/cvm-import-window.ts",
  "lib/utils.ts",
])

// A test is only ever named one of these two ways. `.spec`
// is the other convention and mixing them halves the greppability.
const TEST_SUFFIX = ".test.ts"
const FORBIDDEN_TEST_SUFFIX = ".spec.ts"

// Modifiers that silence or park a suite. A suite that only
// passes on one machine is worse than no suite at all.
const FOCUS_MODIFIERS = [
  /\.(only|skip|todo)\b/,
  /\b(describe|it)\.(only|skip|todo)\b/,
]

interface Violation {
  rule: string
  path: string
  detail: string
}

const VIOLATIONS: Violation[] = []

/**
 * @summary
 * Reports a rule violation.
 *
 * @param rule - Identifier of the broken rule.
 * @param path - Repository relative path of the offender.
 * @param detail - Human readable explanation.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function Report(
  rule: string,
  path: string,
  detail: string
): void {
  VIOLATIONS.push({ rule, path, detail })
}

/**
 * @summary
 * Lists the entries of a directory.
 *
 * @param directory - Absolute path to read.
 *
 * @returns The entry names, or an empty list when absent.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function ListEntries(directory: string): string[] {
  if (!existsSync(directory)) {
    return []
  }

  return readdirSync(directory)
}

/**
 * @summary
 * Lists every project file below a root, skipping the
 * directories that are not project source.
 *
 * @param root - Absolute path to walk.
 *
 * @returns Absolute paths of the files.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function WalkFiles(root: string): string[] {
  const FOUND: string[] = []

  for (const entry of ListEntries(root)) {
    const FULL = resolve(root, entry)

    if (statSync(FULL).isDirectory()) {
      if (SKIPPED_DIRECTORIES.includes(entry)) {
        continue
      }

      FOUND.push(...WalkFiles(FULL))
    } else {
      FOUND.push(FULL)
    }
  }

  return FOUND
}

/**
 * @summary
 * Turns an absolute path into a repository relative one
 * with forward slashes.
 *
 * @param path - Absolute path to shorten.
 *
 * @returns The path relative to the repository root.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function ToRelative(path: string): string {
  return relative(resolve("."), path).split(sep).join("/")
}

/**
 * @summary
 * Resolves the expected test path of a production file.
 *
 * @param path - Repository relative production path.
 *
 * @returns The test path the file must have, or `null` when
 * no rule covers it.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function ExpectedTestPath(path: string): string | null {
  for (const rule of MIRROR_RULES) {
    const MATCH = rule.from.exec(path)

    if (!MATCH) {
      continue
    }

    return rule.to.replace("$1", MATCH[1] ?? "")
  }

  return null
}

/**
 * @summary
 * Reports a production file whose mirror test is missing, and
 * remembers every expected test so a stray suite can be caught.
 *
 * @remarks
 * The suite is uniform by construction rather than by habit:
 * a reviewer can trust that `foo.repository.test.ts` exists
 * because the rule walks `foo.repository.ts`, not because
 * somebody remembered to write it.
 *
 * @returns Every test path the tree is expected to hold.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function CheckMirroredCoverage(): Set<string> {
  const EXPECTED = new Set<string>()

  for (const root of MIRRORED_ROOTS) {
    for (const file of WalkFiles(resolve(root))) {
      const PATH = ToRelative(file)

      if (NO_TEST_NEEDED.has(PATH)) {
        continue
      }

      const TARGET = ExpectedTestPath(PATH)

      if (!TARGET) {
        continue
      }

      EXPECTED.add(TARGET)

      if (existsSync(resolve(TARGET))) {
        continue
      }

      Report("mirrored-coverage", PATH, `needs ${TARGET}`)
    }
  }

  return EXPECTED
}

/**
 * @summary
 * Tells whether a suite is the database-backed twin of one of
 * the listed service flows.
 *
 * @remarks
 * The listed flows already hold a unit suite. This one is the
 * only suite of its kind, so it would otherwise read as stray.
 *
 * @param path - Repository relative test path.
 *
 * @returns True when the suite is a known integration flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function IsIntegrationFlow(path: string): boolean {
  return INTEGRATION_FLOWS.some(
    (flow) =>
      path === `${INTEGRATION_ROOT}/${flow}${TEST_SUFFIX}`
  )
}

/**
 * @summary
 * Reports a test file no production file asks for, so a suite
 * never drifts away from the file it claims to cover.
 *
 * @param expected - Every test path the tree is expected to hold.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function CheckNoStrayTests(expected: Set<string>): void {
  for (const file of WalkFiles(resolve(TESTS_ROOT))) {
    const PATH = ToRelative(file)

    if (!PATH.endsWith(TEST_SUFFIX)) {
      continue
    }

    if (!PATH.startsWith(`${UNIT_ROOT}/`)) {
      if (!PATH.startsWith(`${INTEGRATION_ROOT}/`)) {
        Report(
          "test-location",
          PATH,
          `a suite belongs to ${UNIT_ROOT}/ or ${INTEGRATION_ROOT}/`
        )
      }
    }

    if (expected.has(PATH)) {
      continue
    }

    if (IsIntegrationFlow(PATH)) {
      continue
    }

    Report(
      "no-stray-test",
      PATH,
      "no production file asks for this suite"
    )
  }
}

/**
 * @summary
 * Reports a helper outside the setup folder, or a setup file
 * that is not marked as one, so a glob never picks a helper
 * up as a suite.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function CheckSetupNaming(): void {
  for (const file of WalkFiles(resolve(SETUP_ROOT))) {
    const PATH = ToRelative(file)
    const BASE = file.split(sep).pop() ?? ""

    if (!BASE.startsWith("_")) {
      Report("setup-prefix", PATH, "a helper is prefixed with _")
    }

    if (!BASE.endsWith(".setup.ts")) {
      Report(
        "setup-suffix",
        PATH,
        "a helper ends with .setup.ts"
      )
    }
  }
}

/**
 * @summary
 * Reports a file under the test tree that belongs to neither
 * half, so the two suites stay the only shapes a test has.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function TestTreeShape(): void {
  for (const entry of ListEntries(resolve(TESTS_ROOT))) {
    if (statSync(resolve(TESTS_ROOT, entry)).isDirectory()) {
      continue
    }

    Report(
      "test-tree-shape",
      `${TESTS_ROOT}/${entry}`,
      "a file at the test root belongs to a folder"
    )
  }
}

/**
 * @summary
 * Reports a `.spec` file, a suite with no case, a case whose
 * title is not written as a behaviour, and any modifier that
 * parks or focuses a suite.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function CheckSuiteBody(): void {
  for (const file of WalkFiles(resolve(TESTS_ROOT))) {
    const PATH = ToRelative(file)
    const BASE = file.split(sep).pop() ?? ""

    if (BASE.endsWith(FORBIDDEN_TEST_SUFFIX)) {
      Report(
        "test-suffix",
        PATH,
        "a suite is named .test.ts, never .spec.ts"
      )

      continue
    }

    if (!BASE.endsWith(TEST_SUFFIX)) {
      continue
    }

    const SOURCE = readFileSync(file, "utf8")

    if (/^export default /m.test(SOURCE)) {
      Report(
        "named-exports",
        PATH,
        "use a named export, not export default"
      )
    }

    for (const pattern of FOCUS_MODIFIERS) {
      if (pattern.test(SOURCE)) {
        Report(
          "no-focused-suite",
          PATH,
          "never use .only, .skip or .todo"
        )

        break
      }
    }

    const CASES = [...SOURCE.matchAll(/\bit\(/g)]

    if (CASES.length === 0) {
      Report(
        "suite-has-cases",
        PATH,
        "a suite holds at least one case"
      )
    }

    for (const [, title] of SOURCE.matchAll(
      /\bit\(\s*["'`]([^"'`]+)["'`]/g
    )) {
      if (title.startsWith("should ")) {
        continue
      }

      Report(
        "case-title",
        PATH,
        `"${title}" starts with "should"`
      )
    }
  }
}

/**
 * @summary
 * Prints the findings grouped by rule and fails the process
 * when the contract is broken.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-02
 */
function Main(): void {
  const EXPECTED = CheckMirroredCoverage()

  CheckNoStrayTests(EXPECTED)
  CheckSetupNaming()
  TestTreeShape()
  CheckSuiteBody()

  if (VIOLATIONS.length === 0) {
    process.stdout.write(
      `test-structure: ${EXPECTED.size} mirrored suite(s) hold\n`
    )

    return
  }

  const BY_RULE = new Map<string, Violation[]>()

  for (const violation of VIOLATIONS) {
    const GROUP = BY_RULE.get(violation.rule) ?? []

    GROUP.push(violation)
    BY_RULE.set(violation.rule, GROUP)
  }

  for (const [rule, group] of BY_RULE) {
    process.stdout.write(`\n${rule} (${group.length})\n`)

    for (const violation of group) {
      process.stdout.write(
        `  ${violation.path}\n    ${violation.detail}\n`
      )
    }
  }

  process.stdout.write(
    `\ntest-structure: ${VIOLATIONS.length} violation(s)\n`
  )
  process.exitCode = 1
}

Main()
