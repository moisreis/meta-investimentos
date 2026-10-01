import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs"
import {
  basename,
  dirname,
  join,
  relative,
  resolve,
  sep,
} from "node:path"
import ts from "typescript"

// The presentation contract, as machine-checkable rules. The
// sibling `check-structure.ts` owns the folder shape; this file
// owns the file shape, the export shape and the layering, so
// neither has to know about the other.

const ROOT = resolve("presentation")

// Suffixes a `.ts` file may end with. A file with none of them
// has no declared concern, which is how duplicates creep in.
const FILE_SUFFIXES = [
  ".action.ts",
  ".constants.ts",
  ".container.ts",
  ".helper.ts",
  ".hook.ts",
  ".mapper.ts",
  ".mask.ts",
  ".presenter.ts",
  ".settings.ts",
  ".store.ts",
  ".types.ts",
  ".validation.ts",
] as const

// Hooks a list module owns. `pages/list.tsx` renders a
// datatable, so the four hooks behind it always exist together.
const LIST_HOOKS = [
  "-datatable.hook.ts",
  "-datatable-filters.hook.ts",
  "-kpis.hook.ts",
  "-row-actions.hook.ts",
] as const

// The four files a `datatable/` folder is made of.
const DATATABLE_FILES = [
  "filters.tsx",
  "table-columns.tsx",
  "table.tsx",
  "toolbar.tsx",
] as const

// Folders whose file names prefix the entity. The rest name
// the role the file plays inside the folder.
const ENTITY_PREFIXED_FOLDERS = [
  "actions",
  "components",
  "helpers",
  "hooks",
  "jobs",
  "types",
  "validations",
] as const

// Verbs an action may be named after. `add-` is reserved for
// the dialog and the form, where the user is adding.
// The verbs an action may be named after. `add-` is deliberately
// absent: the user is adding, but the action creates. `generate-`
// is the one extension over CRUD, for the single action that
// dispatches a report build instead of writing a row.
const ACTION_VERBS = [
  "bulk-delete",
  "create",
  "delete",
  "generate",
  "get",
  "list",
  "reverse",
  "start",
  "update",
] as const

// Layers only `presentation/composition/` is allowed to reach.
const INNER_LAYERS: ReadonlySet<string> = new Set([
  "clients",
  "database",
  "domain",
  "infrastructure",
])

interface Violation {
  readonly rule: string
  readonly path: string
  readonly detail: string
}

const VIOLATIONS: Violation[] = []

function Report(
  rule: string,
  path: string,
  detail: string
): void {
  VIOLATIONS.push({ rule, path, detail })
}

function ToRelative(path: string): string {
  return relative(resolve("."), path).split(sep).join("/")
}

function WalkFiles(directory: string): string[] {
  if (!existsSync(directory)) return []
  const found: string[] = []
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry)
    if (statSync(full).isDirectory())
      found.push(...WalkFiles(full))
    else found.push(full)
  }
  return found
}

function ListDirectories(directory: string): string[] {
  if (!existsSync(directory)) return []
  return readdirSync(directory)
    .map((entry) => join(directory, entry))
    .filter((entry) => statSync(entry).isDirectory())
}

/** Reads a source file as LF text. */
function Read(file: string): string {
  return readFileSync(file, "utf8").replace(/\r\n/g, "\n")
}

/** Resolves one import specifier to a file, or `null`. */
function ResolveSpecifier(
  specifier: string,
  from: string
): string | null {
  let base: string
  if (specifier.startsWith("@/"))
    base = resolve(specifier.slice(2))
  else if (specifier.startsWith("."))
    base = resolve(dirname(from), specifier)
  else return null

  for (const candidate of [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    join(base, "index.ts"),
    join(base, "index.tsx"),
  ]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate
    }
  }
  return null
}

/** Every import specifier of a file, in source order. */
function ImportSpecifiers(file: string): string[] {
  const source = Read(file)
  const out: string[] = []
  const pattern = /(?:from|import)\s+["']([^"']+)["']/g
  let match = pattern.exec(source)
  while (match) {
    out.push(match[1] ?? "")
    match = pattern.exec(source)
  }
  return out
}

/**
 * Reports a `.ts` file whose name declares no concern.
 */
function CheckFileSuffix(files: string[]): void {
  for (const file of files) {
    if (!file.endsWith(".ts") || file.endsWith(".d.ts")) continue
    const name = basename(file)
    const ok = FILE_SUFFIXES.some((suffix) =>
      name.endsWith(suffix)
    )
    if (!ok) {
      Report(
        "file-suffix",
        ToRelative(file),
        `name the concern: ${FILE_SUFFIXES.join(", ")}`
      )
    }
  }
}

/**
 * Reports a barrel file, which hides where a symbol lives.
 */
function CheckNoBarrel(files: string[]): void {
  for (const file of files) {
    if (/^index\.tsx?$/.test(basename(file))) {
      Report(
        "no-barrel",
        ToRelative(file),
        "import the file directly"
      )
    }
  }
}

/**
 * Reports a file no import reaches, so dead code is deleted
 * rather than left to rot.
 */
function CheckReachable(
  files: string[],
  allProjectFiles: string[]
): void {
  const reachable = new Set<string>()

  for (const file of allProjectFiles) {
    for (const specifier of ImportSpecifiers(file)) {
      const target = ResolveSpecifier(specifier, file)
      if (target) reachable.add(resolve(target))
    }
  }

  for (const file of files) {
    if (!reachable.has(resolve(file))) {
      Report(
        "no-dead-file",
        ToRelative(file),
        "no import points at this file"
      )
    }
  }
}

/**
 * Reports a presentation file that reaches into an inner layer.
 *
 * @remarks
 * `composition/` is the one wiring point, so it is exempt: a
 * container is supposed to know which repository a use case
 * needs. Every other file takes what it needs from a container
 * or from a shared shelf, which is what keeps a screen testable
 * without a database.
 */
function CheckLayering(files: string[]): void {
  for (const file of files) {
    const isComposition = ToRelative(file).startsWith(
      "presentation/composition/"
    )
    if (isComposition) continue

    const reported = new Set<string>()

    for (const specifier of ImportSpecifiers(file)) {
      const target = ResolveSpecifier(specifier, file)
      if (!target) continue
      const layer = ToRelative(target).split("/")[0] ?? ""
      if (!INNER_LAYERS.has(layer)) continue
      if (reported.has(layer)) continue
      reported.add(layer)
      Report(
        "no-inner-layer-import",
        ToRelative(file),
        `reaches into ${layer}/, so import a container instead`
      )
    }
  }
}

/**
 * Reports a shared part that imports a route.
 *
 * @remarks
 * A part is rendered by many screens, so it cannot own a
 * route: whichever screen renders it supplies the server
 * action as a prop, and the dependency points one way, from
 * the route that knows its query to the part that shows it.
 */
function CheckPartRouteImports(files: string[]): void {
  for (const file of files) {
    const relativePath = ToRelative(file)
    const isShared =
      relativePath.startsWith("presentation/parts/") ||
      relativePath.startsWith("presentation/ui/")
    if (!isShared) continue

    for (const specifier of ImportSpecifiers(file)) {
      const target = ResolveSpecifier(specifier, file)
      if (!target) continue
      if (
        !ToRelative(target).startsWith("presentation/routes/")
      ) {
        continue
      }
      Report(
        "no-route-import",
        relativePath,
        "take the route's action from props instead"
      )
      break
    }
  }
}

/**
 * Reports an action named after a verb outside the vocabulary.
 */
function CheckActionVerbs(files: string[]): void {
  for (const file of files) {
    if (!ToRelative(file).includes("/routes/")) continue
    if (!file.endsWith(".action.ts")) continue

    const name = basename(file).replace(/\.action\.ts$/, "")
    const verb = name.split("-").slice(0, 2).join("-")
    const single = name.split("-")[0] ?? ""
    const known =
      ACTION_VERBS.includes(
        verb as (typeof ACTION_VERBS)[number]
      ) ||
      ACTION_VERBS.includes(
        single as (typeof ACTION_VERBS)[number]
      )

    if (known) continue

    Report(
      "action-verb",
      ToRelative(file),
      `use one of: ${ACTION_VERBS.join(", ")}`
    )
  }
}

/**
 * Reports a folder whose file names drop the entity prefix the
 * folder contract asks for.
 *
 * @remarks
 * A file name has to name its entity even out of context, so a
 * stack trace or a search result says which slice of the product
 * it belongs to. A plural tail is accepted, because a file that
 * lists the collection is named after the collection: the
 * `load-banks` helper and the `bulk-delete-banks` action both
 * carry `bank`.
 *
 * A parenthesised folder is a route group rather than an entity
 * slice, so it is exempt: `(auth)` groups the sign-in and
 * sign-up flows under one shell, and neither flow is named
 * `auth`.
 *
 * An irregular plural is listed rather than guessed, because
 * `category` becomes `categories` and no suffix rule can tell
 * that from a typo. The list is the whole set of exceptions,
 * so a new one is a deliberate edit.
 */
const IRREGULAR_PLURALS: Readonly<Record<string, string>> = {
  category: "categories",
}

function CheckEntityPrefixes(modules: string[]): void {
  for (const routeDirectory of modules) {
    const route = basename(routeDirectory)
    if (/^\(.+\)$/.test(route)) continue

    const segments = route.split("-")
    const accepted = [segments.join("-")]
    const irregular =
      IRREGULAR_PLURALS[segments[segments.length - 1] ?? ""]
    if (irregular) {
      accepted.push(
        [...segments.slice(0, -1), irregular].join("-")
      )
    }

    for (const folder of ENTITY_PREFIXED_FOLDERS) {
      const directory = join(routeDirectory, folder)
      if (!existsSync(directory)) continue

      for (const file of WalkFiles(directory)) {
        const name = basename(file).replace(
          /\.[^.]+(\.[^.]+)?$/,
          ""
        )
        const parts = name.split("-")

        if (
          accepted.some((entity) =>
            CarriesEntity(parts, entity.split("-"))
          )
        ) {
          continue
        }

        Report(
          "entity-prefix",
          ToRelative(file),
          `name the entity: ${segments.join("-")}`
        )
      }
    }
  }
}

/**
 * Tells whether a hyphenated file name carries a hyphenated
 * entity, allowing a plural `s` on the entity's last segment.
 */
function CarriesEntity(
  parts: string[],
  segments: string[]
): boolean {
  for (let start = 0; start < parts.length; start += 1) {
    for (let end = start; end < parts.length; end += 1) {
      const candidate = parts.slice(start, end + 1)
      if (candidate.length > segments.length) break
      if (SameSegments(candidate, segments)) return true

      const last = candidate[candidate.length - 1] ?? ""
      if (last.endsWith("s") && !last.endsWith("ss")) {
        const singular = [
          ...candidate.slice(0, -1),
          last.slice(0, -1),
        ]
        if (SameSegments(singular, segments)) return true
      }
    }
  }
  return false
}

function SameSegments(left: string[], right: string[]): boolean {
  return (
    left.length === right.length &&
    left.every((part, index) => part === right[index])
  )
}

/**
 * Reports a `types/` file that exports behaviour, so a reader
 * who opens it to find a shape also finds a derivation.
 *
 * @remarks
 * A `types/` file that builds options is a helper with the
 * wrong suffix: the derivation then looks like a declaration
 * because of where it sits, and the folder it belongs in is
 * the one a reader checks first. Splitting it puts the
 * behaviour where the eye already expects it.
 *
 * A constant is allowed, because an empty collection or a
 * frozen table is part of the shape rather than a
 * derivation from other shapes.
 */
function CheckTypesAreDeclarations(files: string[]): void {
  for (const file of files) {
    if (!file.endsWith(".types.ts")) continue

    const source = Read(file)
    const sf = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    )

    const visit = (node: ts.Node): void => {
      if (
        ts.isFunctionDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isEnumDeclaration(node)
      ) {
        const name = node.name?.text ?? "an anonymous function"
        Report(
          "types-are-declarations",
          ToRelative(file),
          `exports ${name}, which belongs in helpers/`
        )
      }

      if (
        ts.isVariableStatement(node) &&
        node.modifiers?.some(
          (m) => m.kind === ts.SyntaxKind.ExportKeyword
        )
      ) {
        for (const declaration of node.declarationList
          .declarations) {
          if (
            ts.isIdentifier(declaration.name) &&
            declaration.initializer &&
            (ts.isArrowFunction(declaration.initializer) ||
              ts.isFunctionExpression(declaration.initializer))
          ) {
            Report(
              "types-are-declarations",
              ToRelative(file),
              `exports ${declaration.name.text}, which belongs in helpers/`
            )
          }
        }
      }

      ts.forEachChild(node, visit)
    }
    visit(sf)
  }
}

/**
 * Reports a file that re-exports another file, which is a
 * barrel with a different name.
 *
 * @remarks
 * A barrel hides where a symbol lives, so a reader has to open
 * the file to learn it, and a rename has to be chased through
 * every hop. Importing the file that declares a symbol also
 * keeps the dependency honest: the caller names the owner.
 */
function CheckNoReExport(files: string[]): void {
  for (const file of files) {
    const source = Read(file)
    const sf = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith(".tsx")
        ? ts.ScriptKind.TSX
        : ts.ScriptKind.TS
    )

    const visit = (node: ts.Node): void => {
      if (
        ts.isExportDeclaration(node) &&
        node.moduleSpecifier &&
        node.exportClause
      ) {
        const at =
          sf.getLineAndCharacterOfPosition(node.getStart(sf))
            .line + 1
        Report(
          "no-re-export",
          ToRelative(file),
          `line ${at} re-exports from ${node.moduleSpecifier.getText(sf)}`
        )
      }
      ts.forEachChild(node, visit)
    }
    visit(sf)
  }
}

/**
 * Reports the composition breaches of the route contract, over
 * the whole route tree rather than one module at a time.
 */
function CheckComposition(files: string[]): void {
  const HOOK_NAMES = new Set([
    "useCallback",
    "useContext",
    "useEffect",
    "useId",
    "useLayoutEffect",
    "useMemo",
    "useReducer",
    "useRef",
    "useState",
  ])

  // Attributes whose value names a contract rather than copy.
  const STRUCTURAL = new Set([
    "action",
    "as",
    "autoComplete",
    "colSpan",
    "htmlFor",
    "id",
    "inputMode",
    "method",
    "name",
    "role",
    "rowSpan",
    "scope",
    "size",
    "type",
    "variant",
  ])

  for (const file of files) {
    const rel = ToRelative(file)
    if (!rel.startsWith("presentation/routes/")) continue
    if (!file.endsWith(".tsx")) continue

    const source = Read(file)
    const sf = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    )
    const at = (node: ts.Node): number =>
      sf.getLineAndCharacterOfPosition(node.getStart(sf)).line +
      1

    let components = 0

    const returnsJsx = (
      body: ts.ConciseBody | undefined
    ): boolean => {
      if (!body) return false
      const isJsx = (raw: ts.Expression): boolean => {
        const expr = ts.isParenthesizedExpression(raw)
          ? raw.expression
          : raw
        return (
          ts.isJsxElement(expr) ||
          ts.isJsxFragment(expr) ||
          ts.isJsxSelfClosingElement(expr)
        )
      }
      if (!ts.isBlock(body)) return isJsx(body)
      return body.statements.some(
        (st) =>
          ts.isReturnStatement(st) &&
          !!st.expression &&
          isJsx(st.expression)
      )
    }

    const visit = (node: ts.Node): void => {
      if (
        ts.isJsxOpeningElement(node) ||
        ts.isJsxSelfClosingElement(node)
      ) {
        const tag = node.tagName
        if (ts.isIdentifier(tag) && /^[a-z]/.test(tag.text)) {
          Report(
            "composition",
            rel,
            `line ${at(node)} renders <${tag.text}>`
          )
        }
        for (const attr of node.attributes.properties) {
          if (!ts.isJsxAttribute(attr)) continue
          const name = attr.name.getText(sf)
          if (name === "className" || name === "style") {
            Report(
              "composition",
              rel,
              `line ${at(attr)} sets ${name}`
            )
          }
          if (
            attr.initializer &&
            ts.isStringLiteral(attr.initializer) &&
            !STRUCTURAL.has(name)
          ) {
            const value = attr.initializer.text
            if (
              /[A-Za-zÀ-ÿ]/.test(value) &&
              !/^[a-z-]+$/.test(value)
            ) {
              Report(
                "composition",
                rel,
                `line ${at(attr)} hard-codes ${name}="${value.slice(0, 32)}"`
              )
            }
          }
        }
      }

      if (ts.isJsxText(node)) {
        const text = node.text.trim()
        if (text.length > 0 && !/^[{}]/.test(text)) {
          Report(
            "composition",
            rel,
            `line ${at(node)} hard-codes copy "${text.slice(0, 32)}"`
          )
        }
      }

      if (
        ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node)
      ) {
        let named = false
        if (ts.isFunctionDeclaration(node)) {
          named = node.name !== undefined
        } else {
          const parent = node.parent
          named =
            !!parent &&
            ts.isVariableDeclaration(parent) &&
            ts.isIdentifier(parent.name) &&
            /^[A-Z]/.test(parent.name.text)
        }
        if (named && returnsJsx(node.body)) components += 1
      }

      if (ts.isCallExpression(node)) {
        const callee = node.expression
        if (
          ts.isIdentifier(callee) &&
          HOOK_NAMES.has(callee.text)
        ) {
          Report(
            "composition",
            rel,
            `line ${at(node)} calls ${callee.text}`
          )
        }
        if (
          ts.isPropertyAccessExpression(callee) &&
          /^use[A-Z]/.test(callee.name.text)
        ) {
          Report(
            "composition",
            rel,
            `line ${at(node)} calls ${callee.name.text}`
          )
        }
      }

      if (ts.isJsxExpression(node)) {
        const expr = node.expression
        if (
          expr &&
          (ts.isArrowFunction(expr) ||
            ts.isFunctionExpression(expr)) &&
          !ts.isBlock(expr.body) &&
          (ts.isJsxElement(expr.body) ||
            ts.isJsxFragment(expr.body) ||
            ts.isJsxSelfClosingElement(expr.body))
        ) {
          Report(
            "composition",
            rel,
            `line ${at(node)} inlines markup in an expression`
          )
        }
      }

      if (
        ts.isTypeAliasDeclaration(node) ||
        ts.isInterfaceDeclaration(node)
      ) {
        const name = node.name.text
        if (!/(Props|ColumnOptions)$/.test(name)) {
          Report(
            "composition",
            rel,
            `line ${at(node)} declares ${name}, which belongs in types/`
          )
        }
      }

      ts.forEachChild(node, visit)
    }
    visit(sf)

    if (components > 1) {
      Report(
        "composition",
        rel,
        `${components} components in one file`
      )
    }
  }
}

/**
 * Reports a route module that is missing a file its own folders
 * promise: the four datatable files, the list loader, the labels
 * and the hooks behind a list screen.
 */
function CheckModuleContracts(modules: string[]): void {
  for (const routeDirectory of modules) {
    const route = basename(routeDirectory).replace(
      /^\(|\)$/g,
      ""
    )
    if (route.includes("/")) continue

    const datatable = join(routeDirectory, "datatable")
    if (existsSync(datatable)) {
      const present = new Set(
        WalkFiles(datatable).map((f) => basename(f))
      )
      for (const expected of DATATABLE_FILES) {
        if (!present.has(expected)) {
          Report(
            "datatable-contract",
            ToRelative(datatable),
            `a datatable folder always holds ${expected}`
          )
        }
      }
    }

    const settings = join(routeDirectory, "settings")
    if (existsSync(settings)) {
      const present = new Set(
        WalkFiles(settings).map((f) => basename(f))
      )
      if (!present.has("labels.settings.ts")) {
        Report(
          "settings-contract",
          ToRelative(settings),
          "a settings folder always holds labels.settings.ts"
        )
      }
    }

    const listPage = join(routeDirectory, "pages", "list.tsx")
    if (existsSync(listPage)) {
      const helpers = WalkFiles(
        join(routeDirectory, "helpers")
      ).map((f) => basename(f))
      const loader = helpers.find((name) =>
        /^load-[a-z-]*page-props\.helper\.ts$/.test(name)
      )
      if (!loader) {
        Report(
          "list-loader",
          ToRelative(listPage),
          "a list page resolves its props through " +
            "load-<entity>-page-props.helper.ts"
        )
      }

      // A read-only module has nothing to do per row, so the
      // row actions hook only follows a delete action.
      const deletes = existsSync(join(routeDirectory, "actions"))
        ? readdirSync(join(routeDirectory, "actions")).some(
            (name) => name.startsWith("delete-")
          )
        : false

      const hooks = WalkFiles(join(routeDirectory, "hooks")).map(
        (f) => basename(f)
      )
      for (const tail of LIST_HOOKS) {
        if (tail === "-row-actions.hook.ts" && !deletes) continue
        if (hooks.some((name) => name.endsWith(tail))) continue
        Report(
          "list-hooks",
          ToRelative(routeDirectory),
          `a list module owns use-<entity>${tail}`
        )
      }
    }
  }
}

/**
 * Reports a page that loads more than one set of props, so the
 * screen keeps exactly one server boundary.
 */
function CheckPageLoaders(modules: string[]): void {
  for (const routeDirectory of modules) {
    for (const page of WalkFiles(
      join(routeDirectory, "pages")
    )) {
      const loaders = ImportSpecifiers(page).filter(
        (specifier) =>
          /load-[a-z-]*page-props\.helper$/.test(specifier)
      )
      if (loaders.length > 1) {
        Report(
          "one-page-loader",
          ToRelative(page),
          `${loaders.length} page loaders, expected 1`
        )
      }
    }
  }
}

function Main(): void {
  const files = WalkFiles(ROOT)
  const modules = ListDirectories(join(ROOT, "routes"))

  const allProjectFiles = WalkFiles(resolve(".")).filter(
    (file) => /\.(ts|tsx)$/.test(file)
  )

  CheckFileSuffix(files)
  CheckNoBarrel(files)
  CheckLayering(files)
  CheckPartRouteImports(files)
  CheckActionVerbs(files)
  CheckEntityPrefixes(modules)
  CheckNoReExport(files)
  CheckTypesAreDeclarations(files)
  CheckComposition(files)
  CheckModuleContracts(modules)
  CheckPageLoaders(modules)
  CheckReachable(files, allProjectFiles)

  if (VIOLATIONS.length === 0) {
    process.stdout.write(
      "presentation: the file contract holds\n"
    )
    return
  }

  const byRule = new Map<string, Violation[]>()
  for (const violation of VIOLATIONS) {
    byRule.set(violation.rule, [
      ...(byRule.get(violation.rule) ?? []),
      violation,
    ])
  }

  for (const [rule, group] of [...byRule].sort()) {
    process.stdout.write(`\n${rule} (${group.length})\n`)
    for (const violation of group) {
      process.stdout.write(
        `  ${violation.path}\n    ${violation.detail}\n`
      )
    }
  }

  process.stdout.write(
    `\npresentation: ${VIOLATIONS.length} violation(s)\n`
  )
  process.exitCode = 1
}

Main()
