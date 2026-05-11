# Todo List: Franchisorder Rebuild (Elite Service Layer)

**Task ID:** franchisorder-rebuild
**Created:** 2026-05-11

## Phase 1: Core Service Infrastructure
- [x] 1.1 Implement Utilities (logger.ts, errors.ts)
- [x] 1.2 Implement baseQuery.tsx (mirror franchisee-v2)
- [x] 1.3 Implement reducer.tsx (with signout logic)
- [x] 1.4 Implement store.tsx (Redux-Persist + API Middlewares)

## Phase 2: Auth Domain & App Boot
- [x] 2.1 Implement Auth API (services/auth/api.tsx)
- [x] 2.2 Implement Auth Slice (services/auth/slice.tsx)
- [x] 2.3 Implement App Bootstrap (services/bootstrap.tsx)

## Phase 3: Business Domain APIs
- [x] 3.1 Implement Catalog API (services/catalog/api.tsx)
- [x] 3.2 Implement Order API (services/order/api.tsx)
- [x] 3.3 Implement Cart API (services/cart/api.tsx)
- [x] 3.4 Implement Cart Slice (services/cart/slice.tsx)

## Phase 4: UI Refactoring & Logic Integration
- [x] 4.1 Refactor Login Screen
- [x] 4.2 Refactor Catalog Screen
- [x] 4.3 Refactor Order History & Detail
- [x] 4.4 Implement Checkout & Scheduling Logic
- [ ] 4.5 Final Verification & Type Check

---
## Progress Log
- 2026-05-11: Started refactor to Elite Service Layer pattern.
- 2026-05-11: Completed Phase 1 (Infrastructure).
- 2026-05-11: Completed Phase 2 (Auth & Boot).
- 2026-05-11: Completed Phase 3 (Domain APIs & Slices).
- 2026-05-11: Completed Phase 4 (UI Refactor & Integration).
