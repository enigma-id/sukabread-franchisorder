# Implementation Tasks: Franchisorder Rebuild

**Task ID:** franchisorder-rebuild
**Created:** 2026-05-11
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 22 |
| Estimated Effort | 48 hours |
| Phases | 4 |

---

## Phase 1: Core Service Infrastructure
**Goal:** Establish the foundation mirroring `franchisee-v2`.

### Task 1.1: Implement Utilities (`logger.ts`, `errors.ts`)
**Description:** Create robust logging and error detection helpers.
**Acceptance Criteria:**
- [ ] `logger.ts` supports `apiRequest`, `apiResponse`, and `apiHeaders`.
- [ ] `errors.ts` includes `isAuthError` helper.
**Effort:** 2 hours | **Priority:** High | **Dependencies:** None

### Task 1.2: Implement `baseQuery.tsx`
**Description:** Create the centralized RTK Query fetch wrapper with token injection and binary handling.
**Acceptance Criteria:**
- [ ] Injects Bearer token from `auth.session.token`.
- [ ] `responseHandler` handles `application/octet-stream` via `file-saver`.
- [ ] Catches 401/403 and dispatches global `signout`.
**Effort:** 4 hours | **Priority:** High | **Dependencies:** 1.1

### Task 1.3: Implement `reducer.tsx`
**Description:** Combine all reducers and implement the global signout reset logic.
**Acceptance Criteria:**
- [ ] Resets entire state to `undefined` on `signout`.
- [ ] Clears `localStorage` on signout.
**Effort:** 2 hours | **Priority:** High | **Dependencies:** 1.2

### Task 1.4: Implement `store.tsx`
**Description:** Configure Redux Toolkit store with Redux-Persist.
**Acceptance Criteria:**
- [ ] Persists `auth` and `order` (cart) slices.
- [ ] Blacklists API slices from persistence.
**Effort:** 2 hours | **Priority:** High | **Dependencies:** 1.3

---

## Phase 2: Auth Domain & App Boot
**Goal:** Implement the session lifecycle and seamless login logic.

### Task 2.1: Implement Auth API (`services/auth/api.tsx`)
**Description:** Define `signin`, `seamless`, `getMe`, and `updateMe` endpoints.
**Acceptance Criteria:**
- [ ] All 4 endpoints implemented with TS interfaces.
**Effort:** 3 hours | **Priority:** High | **Dependencies:** 1.4

### Task 2.2: Implement Auth Slice (`services/auth/slice.tsx`)
**Description:** Manage session state and user profile.
**Acceptance Criteria:**
- [ ] Handles `signin.matchFulfilled` to store tokens.
- [ ] Implements `signout` action.
**Effort:** 2 hours | **Priority:** High | **Dependencies:** 2.1

### Task 2.3: Implement App Bootstrap (`services/bootstrap.ts`)
**Description:** Handle URL-parameter parsing and initial session check.
**Acceptance Criteria:**
- [ ] Reads `username` from `window.location`.
- [ ] Dispatches `$signout` then `$seamless` if `username` present.
- [ ] Calls `App.$ready()` after init.
**Effort:** 3 hours | **Priority:** High | **Dependencies:** 2.2

---

## Phase 3: Business Domain APIs
**Goal:** Implement the core business logic endpoints.

### Task 3.1: Implement Catalog API (`services/catalog/api.tsx`)
**Description:** `getCatalog` and `showCatalog`.
**Acceptance Criteria:**
- [ ] Supports complex query strings (search, page, limit, order_by).
**Effort:** 2 hours | **Priority:** Medium | **Dependencies:** 1.2

### Task 3.2: Implement Order API (`services/order/api.tsx`)
**Description:** `getOrders`, `showOrder`, `cancelOrder`, `getOrderPaymentMethod`.
**Acceptance Criteria:**
- [ ] `cancelOrder` uses `PUT` with `void_note`.
**Effort:** 4 hours | **Priority:** High | **Dependencies:** 1.2

### Task 3.3: Implement Cart API (`services/cart/api.tsx`)
**Description:** `checkout`, `getPaymentMethods`, `getSchedule`.
**Acceptance Criteria:**
- [ ] `getSchedule` and `checkout` use `POST`.
**Effort:** 3 hours | **Priority:** High | **Dependencies:** 1.2

### Task 3.4: Implement Cart Slice (`services/cart/slice.tsx`)
**Description:** Manage local order state (items, total).
**Acceptance Criteria:**
- [ ] Items stored as `{ catalog_id, quantity }` for API compatibility.
- [ ] Recalculates total on every change.
**Effort:** 2 hours | **Priority:** High | **Dependencies:** 1.4

---

## Phase 4: UI Refactoring & Logic Integration
**Goal:** Connect the UI to the new elite service layer.

### Task 4.1: Refactor Login Screen
**Description:** Use `authApi` hooks and bootstrap logic.
**Acceptance Criteria:**
- [ ] UI remains identical; logic uses RTK Query.
**Effort:** 2 hours | **Priority:** Medium | **Dependencies:** 2.3

### Task 4.2: Refactor Catalog Screen
**Description:** Integrate `catalogApi` and `cartSlice`.
**Acceptance Criteria:**
- [ ] Supports search and pagination.
**Effort:** 3 hours | **Priority:** Medium | **Dependencies:** 3.1, 3.4

### Task 4.3: Refactor Order History & Detail
**Description:** Integrate `orderApi` with status filters and cancelation.
**Acceptance Criteria:**
- [ ] Detail view allows order cancelation with reason prompt.
**Effort:** 4 hours | **Priority:** Medium | **Dependencies:** 3.2

### Task 4.4: Implement Checkout & Scheduling Logic
**Description:** Integrate `cartApi` for payment methods, schedule, and final post.
**Acceptance Criteria:**
- [ ] User selects date/time from `getSchedule` results.
- [ ] Checkout sends formatted items.
**Effort:** 5 hours | **Priority:** High | **Dependencies:** 3.3

### Task 4.5: Final Verification & Type Check
**Description:** Ensure all TS interfaces match backend responses exactly.
**Acceptance Criteria:**
- [ ] Zero `any` types in services.
- [ ] `npm run build` succeeds.
**Effort:** 2 hours | **Priority:** High | **Dependencies:** All

---

## Quick Reference Checklist

- [ ] 1.1 Utilities (logger/errors)
- [ ] 1.2 baseQuery.tsx
- [ ] 1.3 reducer.tsx
- [ ] 1.4 store.tsx
- [ ] 2.1 authApi
- [ ] 2.2 authSlice
- [ ] 2.3 bootstrap.ts
- [ ] 3.1 catalogApi
- [ ] 3.2 orderApi
- [ ] 3.3 cartApi
- [ ] 3.4 cartSlice
- [ ] 4.1 Login Refactor
- [ ] 4.2 Catalog Refactor
- [ ] 4.3 Order Refactor
- [ ] 4.4 Checkout/Schedule Logic
- [ ] 4.5 Final Verification

## Next Steps

1. Review task breakdown.
2. Run `/implement franchisorder-rebuild` to start Phase 1.

---

*Tasks created with SDD 4.0*
