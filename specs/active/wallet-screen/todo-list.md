# Implementation Todo List: Wallet Screen

**Task ID:** wallet-screen
**Created:** 2026-08-20
**Status:** In Progress

## Todo Phases

### Phase 1: Types & Hooks Verification
- [x] Task 1: Verify types in `src/services/types/wallet.ts` match API contract
- [x] Task 2: Verify `useWallet()` hook correctly handles outletId and queries

### Phase 2: UI & Logs
- [x] Task 3: Implement "Load More" button for balance logs pagination

### Phase 3: Registration
- [x] Task 4: Verify Redux store registration in `src/services/reducer.tsx`

### Phase 4: End-to-End Testing
- [x] Task 5: Perform live Topup request against backend
- [x] Task 6: Perform live Withdrawal request against backend
- [x] Task 7: Confirm withdrawal history visibility in balance logs

## Progress Log

| Date | Task | Status | Notes |
|------|------|--------|-------|
| 2026-08-20 | Update useWallet hook for dynamic limit | Completed | Added pagination parameter |