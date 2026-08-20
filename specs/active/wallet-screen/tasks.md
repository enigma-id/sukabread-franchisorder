# Implementation Tasks: Wallet Screen

**Task ID:** wallet-screen
**Created:** 2026-08-20
**Status:** Ready for Verification/Finalization

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 6 |
| Estimated Effort | 1 hour |
| Phases | 6 |

## Phase 1: Types + API Service
**Goal:** Formalize API contract and types.

### Task 1.1: Formalize Wallet Types
**Description:** Ensure `src/services/types/wallet.ts` accurately matches the live backend API schema.
**Acceptance Criteria:**
- [x] Type definitions match implementation.
**Effort:** 0.1h
**Priority:** High
**Dependencies:** None

---

## Phase 2: Hooks
**Goal:** Ensure hook functionality and error handling.

### Task 2.1: Verify Wallet Hooks
**Description:** Verify `useWallet()` hook correctly parses `outletId` and handles loading/error states.
**Acceptance Criteria:**
- [x] Hook correctly filters queries when `outletId` is missing.
**Effort:** 0.2h
**Priority:** High
**Dependencies:** None

---

## Phase 3: WalletScreen UI
**Goal:** Finalize UI and verify pagination/list handling.

### Task 3.1: Finalize UI & Pagination Strategy
**Description:** Finalize the UI and resolve the pagination vs infinite scroll decision.
**Acceptance Criteria:**
- [x] Implement UI for pagination or confirm list behavior with current limited logs.
**Effort:** 0.3h
**Priority:** Medium
**Dependencies:** None

---

## Phase 4: Register API
**Goal:** Ensure Redux store integration.

### Task 4.1: Verify API Registration
**Description:** Verify `walletApi` is correctly registered in `src/services/reducer.tsx`.
**Acceptance Criteria:**
- [x] Middleware correctly registered.
**Effort:** 0.1h
**Priority:** High
**Dependencies:** None

---

## Phase 5: Route + Menu
**Goal:** Confirm navigation and integration.

### Task 5.1: Confirm Navigation
**Description:** Confirm route and menu integration.
**Acceptance Criteria:**
- [x] Menu item visible and working.
**Effort:** 0.1h
**Priority:** Medium
**Dependencies:** None

---

## Phase 6: Test & Verify
**Goal:** Final system verification.

### Task 6.1: End-to-End API Verification
**Description:** Perform a real-world test against the local backend to confirm API round-trips.
**Acceptance Criteria:**
- [x] Topup request successfully hits backend.
- [x] Withdrawal request successfully hits backend.
- [x] Transaction logs correctly show new entries.
**Effort:** 0.2h
**Priority:** High
**Dependencies:** None

---

## Quick Reference Checklist

- [x] Task 1.1: Formalize Wallet Types
- [x] Task 2.1: Verify Wallet Hooks
- [x] Task 3.1: Finalize UI & Pagination Strategy
- [x] Task 4.1: Verify API Registration
- [x] Task 5.1: Confirm Navigation
- [x] Task 6.1: End-to-End API Verification

## Next Steps

1. Review task breakdown
2. Run `/implement wallet-screen` to finish final verification steps

---

*Tasks created with SDD 4.0*
