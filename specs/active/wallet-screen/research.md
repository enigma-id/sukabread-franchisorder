# Research: Wallet Screen

**Task ID:** wallet-screen
**Date:** 2026-08-20
**Status:** Complete

---

## Executive Summary

The wallet screen needs to display saldo, offer topup/withdrawal actions, and show balance logs. The API contract provides 3 domains: `balance_log`, `outlet_topup_request`, and `withdrawal_request`. This research maps the API contract to frontend implementation using existing RTK Query patterns.

---

## Codebase Analysis

### Existing Patterns

**RTK Query API service pattern** (`src/services/cart/api.tsx`, `src/services/order/api.tsx`):
- Services created with `createApi` + `baseQuery`
- Endpoints defined as `builder.query` / `builder.mutation`
- Hooks exported as `useXxxQuery` / `useXxxMutation`

**Service hook pattern** (`src/services/cart/hooks.tsx`, `src/services/order/hooks.tsx`):
- Centralizes mutations, queries, and dispatch actions
- Returns actions + results for component consumption

**Screen pattern** (`src/screens/ProfileScreen.tsx`):
- Uses `useProfile()` hook for profile data (which contains `outlet.saldo`)
- `StickyHeader` at top, content in `max-w-lg mx-auto`
- Cards with `rounded-[3rem]` or `rounded-3xl`, `premium-shadow`
- Section titles via `SectionTitle` component
- Framer Motion for entrance animations

### Reusable Components

| Component | Location | Use |
|-----------|----------|-----|
| `currencyFormat` | `src/utils/index.ts` | Format money display |
| `StickyHeader` | `src/components/app/StickyHeader` | Top bar |
| `SectionTitle` | `src/components/app/SectionTitle` | Section headers |
| `useProfile` | `src/services/profile/hooks.tsx` | Get saldo from `outlet.saldo` |
| Modal pattern | `src/screens/ProfileScreen.tsx` (logout) | `useEnigmaUI` modal for topup/withdraw forms |
| `useAppSelector` | `src/hooks` | Get `outlet_id` from auth state |

### Conventions to Follow
- RTK Query services in `src/services/wallet/api.tsx`
- Hook in `src/services/wallet/hooks.tsx`
- Types in `src/services/types/wallet.ts`
- Balance log list uses paginated API with `offset`/`limit`

---

## API Contract Mapping

### Frontend → API Endpoints

| Frontend Feature | API Endpoint | Method | Notes |
|-----------------|-------------|--------|-------|
| Show saldo | Profile API (`/profile/me`) | GET | Already available via `outlet.saldo` |
| Topup request | `/topup-request` | POST | `outlet_id`, `money`, `description` |
| Withdrawal request | `/withdrawal-request` | POST | `outlet_id`, `money`, `description` |
| Balance log list | `/balance-log` | GET | Paginated, `limit`, `offset`, `sort=-created_at` |

### Types Needed

```typescript
interface BalanceLog {
  id: number;
  outlet_id: number;
  money: number;        // signed: positive=credit, negative=debit
  type: number;         // 1=topup, 2=withdrawal
  type_label: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface TopupRequest {
  id: number;
  outlet_id: number;
  status: number;
  status_label: string;
  money: number;
  approved_by: number | null;
  description: string;
  created_at: string;
  updated_at: string;
}

interface WithdrawalRequest {
  id: number;
  outlet_id: number;
  status: number;
  status_label: string;
  money: number;
  approved_by: number | null;
  disbursed_by: number | null;
  description: string;
  created_at: string;
  updated_at: string;
}
```

---

## Recommendations

### Implementation Scope (Outlet Owner Role Only)

For the franchise app, the wallet screen serves `outlet_owner` / `outlet_stuff` roles:

1. **View Saldo** — from profile data (already available)
2. **Create Topup Request** — form with money + description
3. **Create Withdrawal Request** — form with money + description
4. **View Balance Logs** — paginated list, newest first

Admin-only features (approve/reject/disburse) are NOT needed on mobile — they belong on the admin dashboard.

### UI Structure

```
┌─────────────────────────┐
│     StickyHeader        │
├─────────────────────────┤
│  ┌───────────────────┐  │
│  │   Saldo Card      │  │
│  │   (gradient bg)   │  │
│  │   Rp X.XXX.XXX    │  │
│  │                   │  │
│  │ [Top Up] [Withd.] │  │
│  └───────────────────┘  │
│                         │
│  ── SALDO LOG ──        │
│                         │
│  ┌───────────────────┐  │
│  │ +Rp 500.000 Topup │  │
│  │   20 Aug 2026     │  │
│  ├───────────────────┤  │
│  │ -Rp 200.000 With. │  │
│  │   19 Aug 2026     │  │
│  └───────────────────┘  │
│                         │
│  [Load more / paginate] │
└─────────────────────────┘
```

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/services/types/wallet.ts` | Create — types |
| `src/services/wallet/api.tsx` | Create — RTK Query endpoints |
| `src/services/wallet/hooks.tsx` | Create — hook |
| `src/screens/WalletScreen.tsx` | Rewrite — full wallet UI |

### Form Pattern (Modal)

Use existing `useEnigmaUI` modal pattern (same as logout confirmation in ProfileScreen):
- Topup form: money input + description textarea + submit
- Withdrawal form: money input + description textarea + submit
- Validation: min Rp 10.000 (per API contract)
- On success: show toast + refetch balance log

---

## Next Steps

1. Create types file
2. Create wallet API service
3. Create wallet hook
4. Rewrite WalletScreen with full UI
5. Test topup/withdrawal form submission
6. Test balance log pagination
