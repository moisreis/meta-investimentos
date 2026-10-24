# Final Tasklist - Meta Investimentos Pre-Production Audit

## Blockers (Must fix before production)

### B-001: Dependency Vulnerabilities
- [ ] **npm audit**: Fix 27 vulnerabilities (5 critical, 17 high, 5 moderate)
- [ ] Review and upgrade vulnerable packages
- [ ] Consider using overrides if necessary

### B-002: Structure Gate Violations
- [ ] **composition (3)**: Remove useMemo calls from dialogs
  - [ ] `presentation/routes/portfolio/dialogs/add.tsx:59` - remove useMemo
  - [ ] `presentation/routes/portfolio/dialogs/edit.tsx:67` - remove useMemo  
  - [ ] `presentation/routes/statement/dialogs/generate-report.tsx:66` - remove useMemo
- [ ] **no-inner-layer-import (2)**: Move domain imports to composition/presenter
  - [ ] `presentation/parts/charts/entity-annual-chart-models.helper.ts` - stop importing from domain, pass computed values
  - [ ] `presentation/routes/statement/actions/get-statement-month.action.ts` - stop importing from domain
- [ ] **no-service-value-import (1)**: Move service imports
  - [ ] `presentation/routes/statement/actions/get-statement-month.action.ts:9` - import constants via composition/presenter

### B-003: RBAC/Middleware Gaps
- [ ] Add `/checking-account` to protected prefixes in `proxy.ts`
- [ ] Enforce authz in all server actions (RequireSessionUser + role checks)
- [ ] Add ownership/scope validation in mutations
- [ ] Review proxy to ensure server actions are properly protected

### B-004: Debug Logging
- [ ] Replace `console.log` in `services/quota/use-cases/import-fund-valuations.use-case.ts` with structured logger
- [ ] Replace `console.error` in `app/api/statement-pdf/route.ts` with structured logger
- [ ] Review all console statements

## High Priority
- [ ] Review portfolio allocation column drop migration safety
- [ ] Complete audit log rendering for all action types (distinct colors/icons)
- [ ] Create `.env.example`
- [ ] Run and verify integration tests pass
- [ ] Ensure all action types render correctly in `/audit-log`

## Medium Priority
- [ ] Review CSRF, security headers, rate limiting
- [ ] Add ADRs/runbook/rollback plan
- [ ] Add RBAC negative tests
- [ ] Complete unwritten integration flows
- [ ] Reduce unjustified `any` usage

## Low Priority
- [ ] Code cleanup
- [ ] Additional documentation
