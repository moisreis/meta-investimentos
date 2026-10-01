// Contract of the dynamic breadcrumb segments. The
// resolvers are built where the routes may be imported
// and handed to the shell, so a part never reaches into
// a route.

// What a resolver answers about one entity id. It mirrors
// the shape of a server action result without importing
// the action, so the shell stays independent of it.
export interface MainBreadcrumbNameResult {
  success: boolean
  data?: string | null
}

// Resolves the display name of one entity id.
export type MainBreadcrumbNameSource = (
  id: string
) => Promise<MainBreadcrumbNameResult>

// Resolvers keyed by the parent href of a dynamic
// segment, such as `/portfolio`.
export type MainBreadcrumbResolvers = Record<
  string,
  MainBreadcrumbNameSource
>
