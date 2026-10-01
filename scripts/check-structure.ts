import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs"
import { dirname, join, relative, resolve, sep } from "node:path"

// Every folder a route is allowed to own. Anything else is
// a typo, a stray folder, or shared chrome that leaked in.
const ALLOWED_ROUTE_FOLDERS = [
  "actions",
  "components",
  "datatable",
  "dialogs",
  "forms",
  "helpers",
  "hooks",
  "jobs",
  "pages",
  "settings",
  "types",
  "validations",
]

// A route group owns pages. These are the extra folders a
// group may hold on top of the route contract.
const ALLOWED_GROUP_FOLDERS = ["layout"]

// Folders whose files must follow one suffix. The key is the
// folder, the value the tail the file name must end with.
const FOLDER_SUFFIX = {
  actions: ".action.ts",
  helpers: ".helper.ts",
  hooks: ".hook.ts",
  jobs: "-job.store.ts",
  settings: ".settings.ts",
  types: ".types.ts",
  validations: ".validation.ts",
}

// A route group exists to scope pages. A parenthesised
// folder with no pages is app chrome in the wrong place.
const GROUP_PAGE_FOLDER = "pages"

// Folders that must never exist anywhere in the project.
// `validations` holds zod schemas and `validators` held
// predicate functions, which is one concept split in two.
const BANNED_FOLDERS = ["validators"]

// Directories that hold routing concerns, checked for empty
// folders and for the rest of the route contract.
const ROUTES_ROOT = "presentation/routes"
const MAIN_ROOT = "app/(main)"

// Verbs whose object is a collection, so a plural entity is
// the accurate name rather than a naming slip.
const COLLECTION_VERBS = ["bulk-delete", "load", "list"]

// Route to route imports that are allowed, and why. The
// Portfolio aggregate is composed of its ledger entries, so
// the portfolio route is the one place that reaches into the
// application and withdrawal routes. It is also the screen
// that carries every action taken on a portfolio, so it
// composes the calculation and the report dialogs of the
// portfolio-performance and statement routes instead of
// duplicating their flows. The application and withdrawal
// forms gate their date field on the quota dates of a fund,
// so both reach into the quota route for that one query.
const CROSS_ROUTE_ALLOWLIST: Record<string, string[]> = {
  application: ["quota"],
  portfolio: [
    "application",
    "withdrawal",
    "portfolio-performance",
    "statement",
  ],
  withdrawal: ["quota"],
}

// An import statement, whichever of the two shapes it takes:
// `import x from "..."` and the bare `import "..."`.
const IMPORT_SPECIFIER = /(?:from|import)\s+["']([^"']+)["']/g

// Leading words that turn a hook file into a verb first name.
// Hooks are named after the thing they serve, so the entity
// comes first: use-bank-add-form, never use-add-bank-form.
const VERB_FIRST_HOOK_PREFIX = [
  "add-",
  "bulk-",
  "create-",
  "delete-",
  "edit-",
  "get-",
  "list-",
  "load-",
  "remove-",
  "update-",
]

// The soft line limit. Prettier is the real enforcer, so the
// rule only has to catch what Prettier would leave alone.
const MAX_LINE_LENGTH = 65

// A route page composes parts, never markup. An intrinsic
// element or a class attribute in a page is the leak this
// rule catches, so the markup and the classes behind a block
// stay in the part that owns them.
const PAGE_INTRINSIC_TAG = /<([a-z][a-z0-9-]*)[\s/>]/
const PAGE_CLASS_ATTRIBUTE = /\bclassName=/

// Line shapes Prettier cannot wrap, so a length rule that
// counted them would only push authors into worse code.
const LINE_EXEMPT = [
  // An import with a single specifier stays on one line, and
  // the tail of a wrapped import has nowhere left to break.
  /^\s*import\b/,
  /^\s*\} from /,
  // JSX: the element itself, an attribute, or its close.
  /^\s*<[A-Za-z]/,
  /^\s*[A-Za-z][\w-]*=/,
  /^\s*[\w-]+:\s/,
  /^\s*\/?>/,
  // A JSX expression that only reads a settings constant, which
  // is where Prettier leaves a long element attribute.
  /^\s*[?:]?\s*\{?[A-Z][A-Z0-9_]*\.[A-Z0-9_]+/,
  // Copy and labels: a string or template literal, alone or
  // behind a return or a ternary arm.
  /^\s*(return )?["'`]/,
  /^\s*[?:]\s*`/,
  // A declaration head that opens a body on the next line. When
  // the identifier itself is the problem, breaking the line
  // hides it instead of fixing it, so a human has to look.
  /^(export )?(default )?(async )?function \w+\([^)]*\)?\s*\{?$/,
  // A signature or a typed declaration head whose length comes
  // from the return type, not from the name.
  /^(export )?(default )?(async )?function \w+\(.*\): .+\{$/,
  /^(export )?(const|let) \w+: [\w<>[\]|, ]+ =$/,
]

// Directories that are not part of the project source. The
// repo wide rules must not walk into them.
const SKIPPED_DIRECTORIES = [".git", ".next", "node_modules"]

// The root of the delivery layer, one level above routes.
const PRESENTATION_ROOT = "presentation"

// The shelf of shared, route independent parts.
const PARTS_ROOT = "presentation/parts"

// Every part names the shelf it sits on, so a file name and
// a folder tell the same story and a reader never has to
// open the file to learn what it is. A hook keeps the `use-`
// prefix it must carry and then names its shelf.
const PART_SHELVES = ["entity-", "shared-", "main-"]

const HOOK_PREFIX = "use-"

// The folders the presentation root may hold. A stray
// `components/` or `hooks/` here is shared chrome that never
// became a part, or a route that never became a route.
const ALLOWED_PRESENTATION_FOLDERS = [
  "composition",
  "constants",
  "mappers",
  "masks",
  "parts",
  "presenters",
  "routes",
  "theme",
  "types",
  "ui",
]

// Markup belongs to a view, so a `.tsx` may only sit where a
// view is built: the primitives, the shell behaviour, a
// part, or a route screen. `datatable/` and a group `layout/`
// are views too, so they stay on the list.
const VIEW_FOLDERS = ["ui", "theme"]
const ROUTE_VIEW_FOLDERS = [
  "components",
  "datatable",
  "dialogs",
  "forms",
  "layout",
  "pages",
]

// Extra entities that are not route names but still appear
// in filenames.
const EXTRA_ENTITIES = ["performance", "norm", "user"]

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
 * @date 2026-09-26
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
 * @date 2026-09-26
 */
function ListEntries(directory: string): string[] {
  if (!existsSync(directory)) {
    return []
  }

  return readdirSync(directory)
}

/**
 * @summary
 * Lists the immediate subdirectories of a directory.
 *
 * @param directory - Absolute path to read.
 *
 * @returns Absolute paths of the subdirectories.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function ListDirectories(directory: string): string[] {
  return ListEntries(directory)
    .map((entry) => join(directory, entry))
    .filter((entry) => statSync(entry).isDirectory())
}

/**
 * @summary
 * Lists every file below a directory, recursively.
 *
 * @param directory - Absolute path to walk.
 *
 * @returns Absolute paths of the files.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function ListFiles(directory: string): string[] {
  const FOUND: string[] = []

  for (const entry of ListEntries(directory)) {
    const FULL = join(directory, entry)

    if (statSync(FULL).isDirectory()) {
      FOUND.push(...ListFiles(FULL))
    } else {
      FOUND.push(FULL)
    }
  }

  return FOUND
}

/**
 * @summary
 * Lists every directory below a root, skipping the ones
 * that are not project source.
 *
 * @param root - Absolute path to walk.
 *
 * @returns Absolute paths of the directories.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function WalkDirectories(root: string): string[] {
  const FOUND: string[] = []

  for (const directory of ListDirectories(root)) {
    const NAME = directory.split(sep).pop() ?? ""

    if (SKIPPED_DIRECTORIES.includes(NAME)) {
      continue
    }

    FOUND.push(directory, ...WalkDirectories(directory))
  }

  return FOUND
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
 * @date 2026-09-26
 */
function WalkFiles(root: string): string[] {
  const FOUND: string[] = []

  for (const directory of WalkDirectories(root)) {
    for (const file of ListEntries(directory)) {
      const FULL = join(directory, file)

      if (!statSync(FULL).isDirectory()) {
        FOUND.push(FULL)
      }
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
 * @date 2026-09-26
 */
function ToRelative(path: string): string {
  return relative(resolve("."), path).split(sep).join("/")
}

/**
 * @summary
 * Builds the plural form of an entity name.
 *
 * @param entity - Singular entity name.
 *
 * @returns The plural entity name.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function Pluralize(entity: string): string {
  if (/[^aeiou]y$/.test(entity)) {
    return `${entity.slice(0, -1)}ies`
  }

  if (/(s|x|z|ch|sh)$/.test(entity)) {
    return `${entity}es`
  }

  return `${entity}s`
}

/**
 * @summary
 * Reports every empty directory below a root.
 *
 * @param root - Absolute path to walk.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckEmptyFolders(root: string): void {
  for (const directory of WalkDirectories(root)) {
    if (ListEntries(directory).length === 0) {
      Report(
        "no-empty-folder",
        ToRelative(directory),
        "folder is empty"
      )
    }
  }
}

/**
 * @summary
 * Reports any banned folder name in the project.
 *
 * @param root - Absolute path to walk, recursively.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckBannedFolders(root: string): void {
  for (const directory of WalkDirectories(root)) {
    const NAME = directory.split(sep).pop() ?? ""

    if (BANNED_FOLDERS.includes(NAME)) {
      Report(
        "no-validators-folder",
        ToRelative(directory),
        "use lib/validation instead"
      )
    }
  }
}

/**
 * @summary
 * Reports a plural schema suffix anywhere in the project.
 *
 * @param root - Absolute path to walk, recursively.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckPluralSchemaSuffix(root: string): void {
  for (const file of WalkFiles(root)) {
    if (file.endsWith(".validations.ts")) {
      Report(
        "singular-suffix",
        ToRelative(file),
        "use .validation.ts, never .validations.ts"
      )
    }
  }
}

/**
 * @summary
 * Reports default exports inside the route tree. Named
 * exports keep a symbol greppable across the project.
 *
 * @param root - Absolute path to walk, recursively.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckNoDefaultExports(root: string): void {
  for (const file of ListFiles(root)) {
    const SOURCE = readFileSync(file, "utf8")

    if (/^export default /m.test(SOURCE)) {
      Report(
        "named-exports",
        ToRelative(file),
        "use a named export, not export default"
      )
    }
  }
}

/**
 * @summary
 * Validates one route folder against the contract.
 *
 * @param routeDirectory - Absolute path of the route.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckRoute(routeDirectory: string): void {
  const ROUTE = routeDirectory.split(sep).pop() ?? ""
  const IS_GROUP = ROUTE.startsWith("(")
  const ALLOWED = IS_GROUP
    ? [...ALLOWED_ROUTE_FOLDERS, ...ALLOWED_GROUP_FOLDERS]
    : ALLOWED_ROUTE_FOLDERS
  const FOLDERS = ListDirectories(routeDirectory)

  for (const folder of FOLDERS) {
    const NAME = folder.split(sep).pop() ?? ""

    if (!ALLOWED.includes(NAME)) {
      Report(
        "known-folder",
        ToRelative(folder),
        `"${NAME}" is not a route folder`
      )
    }
  }

  const HAS = (name: string): boolean =>
    FOLDERS.some((folder) => folder.split(sep).pop() === name)

  if (IS_GROUP && !HAS(GROUP_PAGE_FOLDER)) {
    Report(
      "group-has-pages",
      ToRelative(routeDirectory),
      "a parenthesised folder must own pages"
    )
  }

  if (HAS("actions") && !HAS("validations")) {
    Report(
      "actions-have-validations",
      ToRelative(routeDirectory),
      "a route with actions needs validations"
    )
  }

  for (const folder of FOLDERS) {
    const NAME = folder.split(sep).pop() ?? ""
    const SUFFIX =
      FOLDER_SUFFIX[NAME as keyof typeof FOLDER_SUFFIX]

    if (!SUFFIX) {
      continue
    }

    for (const file of ListFiles(folder)) {
      const BASE = file.split(sep).pop() ?? ""

      if (!BASE.endsWith(SUFFIX)) {
        Report(
          "folder-suffix",
          ToRelative(file),
          `files in ${NAME}/ must end with ${SUFFIX}`
        )
      }
    }
  }

  CheckRedundantPrefix(routeDirectory, ROUTE)
  CheckPluralEntity(routeDirectory, ROUTE)
  CheckPageNames(routeDirectory, IS_GROUP)
}

/**
 * @summary
 * Reports dialog and form files that repeat the entity the
 * route folder already scopes.
 *
 * @param routeDirectory - Absolute path of the route.
 * @param route - Name of the route folder.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckRedundantPrefix(
  routeDirectory: string,
  route: string
): void {
  for (const folder of ["dialogs", "forms"]) {
    const FULL = join(routeDirectory, folder)

    for (const file of ListFiles(FULL)) {
      const BASE = file.split(sep).pop() ?? ""

      if (BASE.startsWith(`${route}-`)) {
        Report(
          "no-redundant-prefix",
          ToRelative(file),
          `the ${route} folder already scopes the entity`
        )
      }
    }
  }
}

/**
 * @summary
 * Reports a plural entity outside a collection verb, where
 * the singular is the accurate name.
 *
 * @param routeDirectory - Absolute path of the route.
 * @param route - Name of the route folder.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckPluralEntity(
  routeDirectory: string,
  route: string
): void {
  const PLURALS = [route, ...EXTRA_ENTITIES].map(Pluralize)

  for (const file of ListFiles(routeDirectory)) {
    const BASE = (file.split(sep).pop() ?? "")
      .replace(/\.(action|helper|hook|validation)\.ts$/, "")
      .replace(/\.tsx$/, "")

    const IS_COLLECTION = COLLECTION_VERBS.some((verb) =>
      BASE.startsWith(`${verb}-`)
    )

    if (IS_COLLECTION) {
      continue
    }

    const SEGMENTS = BASE.split("-")

    for (const plural of PLURALS) {
      if (SEGMENTS.includes(plural)) {
        Report(
          "singular-entity",
          ToRelative(file),
          `"${plural}" is a collection, so it belongs ` +
            `behind a ${COLLECTION_VERBS.join("/")} verb`
        )
      }
    }
  }
}

/**
 * @summary
 * Reports page files outside the list and detail contract. A
 * route group is exempt, because a group scopes named
 * screens such as sign in rather than one entity.
 *
 * @param routeDirectory - Absolute path of the route.
 * @param isGroup - Whether the folder is a route group.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckPageNames(
  routeDirectory: string,
  isGroup: boolean
): void {
  if (isGroup) {
    return
  }

  for (const file of ListFiles(join(routeDirectory, "pages"))) {
    const BASE = file.split(sep).pop() ?? ""
    const ALLOWED = ["list.tsx", "detail.tsx"]

    if (!ALLOWED.includes(BASE)) {
      Report(
        "page-names",
        ToRelative(file),
        `pages/ holds only ${ALLOWED.join(" and ")}`
      )
    }
  }
}

/**
 * @summary
 * Reports a route page that renders raw HTML or sets a
 * className, so a page stays a composition of parts.
 *
 * @remarks
 * A page owns the screen, not the blocks on it. The markup
 * and the Tailwind classes behind a block belong to the part
 * or route component that renders it, so a block no part owns
 * becomes a route component and a block two routes share
 * becomes a part.
 *
 * @param root - Absolute path of the routes root.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function CheckPageComposition(root: string): void {
  for (const route of ListDirectories(root)) {
    for (const file of ListFiles(join(route, "pages"))) {
      const SOURCE = readFileSync(file, "utf8")
      const TAG = PAGE_INTRINSIC_TAG.exec(SOURCE)

      if (TAG) {
        Report(
          "page-composition",
          ToRelative(file),
          `renders <${TAG[1]}>, so move the markup ` +
            "into a part or route component"
        )
      }

      if (PAGE_CLASS_ATTRIBUTE.test(SOURCE)) {
        Report(
          "page-composition",
          ToRelative(file),
          "sets className, so move the styling into a part"
        )
      }
    }
  }
}

/**
 * @summary
 * Reports a main route folder without exactly one page, so
 * every entry in the navigation resolves to a screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
/**
 * @summary
 * Reports a part whose file name does not name its shelf.
 *
 * @remarks
 * A part sits on one of three shelves: the entity kit, the
 * generic shared kit, and the main shell chrome. Naming the
 * shelf in the file keeps the folder tree and the file names
 * telling the same story. A hook keeps the `use-` it must
 * carry and then names its shelf.
 *
 * @param root - Absolute path of the parts root.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function CheckPartsShelves(root: string): void {
  for (const file of ListFiles(resolve(root))) {
    const BASE = file.split(sep).pop() ?? ""
    const SHELF = BASE.replace(HOOK_PREFIX, "")
    const HAS_SHELF = PART_SHELVES.some((prefix) =>
      SHELF.startsWith(prefix)
    )

    if (!HAS_SHELF) {
      Report(
        "parts-shelf-prefix",
        ToRelative(file),
        `name the shelf: ${PART_SHELVES.join(", ")}`
      )
    }
  }
}

/**
 * @summary
 * Reports a folder at the presentation root that is not a
 * presentation concern.
 *
 * @remarks
 * The delivery layer holds routes, the composition layer,
 * the shared shelves and the leaf concerns below them.
 * Anything else is shared chrome that never became a part,
 * or a route that never became a route, and it belongs one
 * level down.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function CheckPresentationRoot(): void {
  for (const folder of ListDirectories(
    resolve(PRESENTATION_ROOT)
  )) {
    const NAME = folder.split(sep).pop() ?? ""

    if (!ALLOWED_PRESENTATION_FOLDERS.includes(NAME)) {
      Report(
        "presentation-root",
        ToRelative(folder),
        `"${NAME}" is not a presentation concern`
      )
    }
  }
}

/**
 * @summary
 * Decides whether a file may hold JSX.
 *
 * @remarks
 * Markup belongs to a view: a primitive under `ui/`, the
 * shell behaviour under `theme/`, any part, or a route
 * screen folder. A `.tsx` anywhere else is markup that
 * escaped the screen it belongs to.
 *
 * @param file - Absolute path of a `.tsx` file.
 *
 * @returns Whether the file sits in a view folder.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function IsViewFile(file: string): boolean {
  const SEGMENTS = ToRelative(file).split("/")
  const LAYER = SEGMENTS[1] ?? ""

  if (VIEW_FOLDERS.includes(LAYER)) {
    return true
  }

  if (LAYER === "parts") {
    return true
  }

  if (LAYER !== "routes") {
    return false
  }

  return ROUTE_VIEW_FOLDERS.includes(SEGMENTS[3] ?? "")
}

/**
 * @summary
 * Reports a `.tsx` file outside a view folder, so markup
 * never leaks into a helper, a type or a data module.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function CheckViewLocation(): void {
  for (const file of ListFiles(resolve(PRESENTATION_ROOT))) {
    if (!file.endsWith(".tsx")) {
      continue
    }

    if (IsViewFile(file)) {
      continue
    }

    Report(
      "view-only-tsx",
      ToRelative(file),
      "markup belongs to a view folder"
    )
  }
}

/**
 * @summary
 * Reports a main route folder without exactly one page, so
 * every entry in the navigation resolves to a screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckMainRoutes(): void {
  for (const directory of ListDirectories(resolve(MAIN_ROOT))) {
    const PAGES = ListFiles(directory).filter((file) => {
      const BASE = file.split(sep).pop() ?? ""

      return BASE === "page.tsx" || BASE === "layout.tsx"
    })

    const HAS_PAGE = PAGES.some(
      (file) => (file.split(sep).pop() ?? "") === "page.tsx"
    )

    if (!HAS_PAGE) {
      Report(
        "main-route-page",
        ToRelative(directory),
        "every app/(main) route needs a page.tsx"
      )
    }
  }
}

/**
 * @summary
 * Resolves the route a file reaches into through one import
 * specifier.
 *
 * @remarks
 * The specifier is resolved against the real location of the
 * importing file, so a relative hop that stays inside the
 * route is not mistaken for a hop into a neighbour. An alias
 * is resolved against the repository root. Anything that does
 * not land in an existing route folder is not a route import
 * and returns `null`.
 *
 * @param fromFile - Absolute path of the importing file.
 * @param specifier - The raw import specifier.
 *
 * @returns The route folder the specifier lands in, or `null`.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function ResolveRouteTarget(
  fromFile: string,
  specifier: string
): string | null {
  const ROUTES = resolve(ROUTES_ROOT)

  let target: string

  if (specifier.startsWith("@/")) {
    target = resolve(specifier.slice(2))
  } else if (specifier.startsWith(".")) {
    target = resolve(dirname(fromFile), specifier)
  } else {
    return null
  }

  const RELATIVE = relative(ROUTES, target)

  if (RELATIVE.startsWith("..") || RELATIVE === "") {
    return null
  }

  const ROUTE = RELATIVE.split(sep)[0] ?? ""

  return existsSync(join(ROUTES, ROUTE)) ? ROUTE : null
}

/**
 * @summary
 * Reports a route that imports from a sibling route. A route
 * owns its screen end to end, so reaching into a neighbour
 * couples two features that can then only be changed together.
 *
 * @remarks
 * The allowlist holds the one composition the domain really
 * has: the Portfolio aggregate is made of its applications and
 * its withdrawals, so the portfolio route composes them and
 * the dependency points the right way.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckCrossRouteImports(): void {
  for (const file of ListFiles(resolve(ROUTES_ROOT))) {
    const OWN = ToRelative(file).split("/")[2] ?? ""
    const SOURCE = readFileSync(file, "utf8")
    const REPORTED = new Set<string>()

    for (const match of SOURCE.matchAll(IMPORT_SPECIFIER)) {
      const TARGET = ResolveRouteTarget(file, match[1] ?? "")

      if (!TARGET || TARGET === OWN) {
        continue
      }

      if (CROSS_ROUTE_ALLOWLIST[OWN]?.includes(TARGET)) {
        continue
      }

      if (REPORTED.has(TARGET)) {
        continue
      }

      REPORTED.add(TARGET)

      Report(
        "no-cross-route-import",
        ToRelative(file),
        `reaches into the ${TARGET} route`
      )
    }
  }
}

/**
 * @summary
 * Reports a hook file named after the operation instead of the
 * entity. Naming every hook after the entity keeps a route
 * folder readable and greppable, because all the hooks of a
 * route then start with the same word.
 *
 * @param routeDirectory - Absolute path of the route.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckHookNaming(routeDirectory: string): void {
  for (const file of ListFiles(join(routeDirectory, "hooks"))) {
    const BASE = (file.split(sep).pop() ?? "")
      .replace(/\.hook\.ts$/, "")
      .replace(/^use-/, "")

    for (const verb of VERB_FIRST_HOOK_PREFIX) {
      if (BASE.startsWith(verb)) {
        Report(
          "noun-first-hook",
          ToRelative(file),
          `name the hook after the entity, not "${verb}"`
        )

        break
      }
    }
  }
}

/**
 * @summary
 * Reports a file that carries no author tag, so every file in
 * the tree says who owns it and when it was written.
 *
 * @param root - Absolute path to walk, recursively.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckTsdocAuthor(root: string): void {
  for (const file of ListFiles(root)) {
    if (!/\.(ts|tsx)$/.test(file)) {
      continue
    }

    if (!readFileSync(file, "utf8").includes("@author")) {
      Report(
        "tsdoc-author",
        ToRelative(file),
        "add a TSDoc block with @author"
      )
    }
  }
}

/**
 * @summary
 * Reports a line Prettier would have left over the limit, once
 * the shapes Prettier cannot wrap are set aside.
 *
 * @remarks
 * A signature or a typed declaration is only exempt when the
 * part before its type fits, so a long name is still caught.
 *
 * @param root - Absolute path to walk, recursively.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckLineLength(root: string): void {
  for (const file of ListFiles(root)) {
    if (!/\.(ts|tsx)$/.test(file)) {
      continue
    }

    const LINES = readFileSync(file, "utf8").split(/\r?\n/)

    LINES.forEach((line, index) => {
      const TEXT = line.trimEnd()

      if (TEXT.length <= MAX_LINE_LENGTH) {
        return
      }

      if (IsExemptLine(TEXT)) {
        return
      }

      Report(
        "line-length",
        ToRelative(file),
        `line ${index + 1} is ${TEXT.length} characters`
      )
    })
  }
}

/**
 * @summary
 * Decides whether a long line is one Prettier cannot shorten
 * without making the code worse.
 *
 * @param text - The line, with trailing spaces removed.
 *
 * @returns Whether the length rule does not apply.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function IsExemptLine(text: string): boolean {
  if (LINE_EXEMPT.some((pattern) => pattern.test(text))) {
    return true
  }

  const SIGNATURE =
    /^(export )?(default )?(async )?function \w+\(([^)]*)\)(?::.+)?\{$/

  if (SIGNATURE.test(text)) {
    const MATCH = SIGNATURE.exec(text) ?? []
    const HEAD = `function ${MATCH[1]}(${MATCH[2]}) {`

    return HEAD.length <= MAX_LINE_LENGTH
  }

  return false
}

/**
 * @summary
 * Prints the findings grouped by rule and fails the process
 * when the contract is broken.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function Main(): void {
  const ROOT = resolve(ROUTES_ROOT)

  for (const route of ListDirectories(ROOT)) {
    CheckRoute(route)
    CheckHookNaming(route)
  }

  CheckEmptyFolders(ROOT)
  CheckEmptyFolders(resolve(MAIN_ROOT))
  CheckBannedFolders(resolve("."))
  CheckPluralSchemaSuffix(resolve("."))
  CheckNoDefaultExports(ROOT)
  CheckPageComposition(ROOT)
  CheckPartsShelves(PARTS_ROOT)
  CheckPresentationRoot()
  CheckViewLocation()
  CheckMainRoutes()
  CheckCrossRouteImports()
  CheckTsdocAuthor(ROOT)
  CheckTsdocAuthor(resolve(MAIN_ROOT))
  CheckLineLength(ROOT)
  CheckLineLength(resolve(MAIN_ROOT))

  if (VIOLATIONS.length === 0) {
    process.stdout.write(
      "structure: the presentation contract holds\n"
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
    `\nstructure: ${VIOLATIONS.length} violation(s)\n`
  )
  process.exitCode = 1
}

Main()
