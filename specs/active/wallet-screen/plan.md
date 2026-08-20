# Technical Plan: Wallet Screen

**Task ID:** wallet-screen
**Status:** Ready for Implementation
**Based on:** spec.md, research.md

## 1. System Architecture

### Overview
Wallet screen is a client-side React feature using existing RTK Query patterns, consuming the `franchise-order` Go microservice endpoints under `/franchise-order` base path.

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────────┐
│  WalletScreen │────►│  useWallet()    │────►│  walletApi (RTKQ)    │
│  (UI)         │     │  (hooks)        │     │  /balance-log        │
└──────────────┘     └─────────────────┘     │  /topup-request      │
       │                                       │  /withdrawal-request │
       ▼                                       └──────────────────────┘
  StickyHeader
  Saldo Card
  Action Buttons
  Balance Log List
  Modals (Topup/Withdrawal)
```

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | RTK Query + Redux | Consistent with existing codebase |
| API Base Path | `/franchise-order` | Matches backend contract |
| Modal Pattern | `useEnigmaUI` Modal | Reuses existing pattern (logout modal) |
| Currency Format | `currencyFormat` util | Reuses existing utility |
| Date Format | dayjs | Already used in codebase |

## 2. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Frontend Framework | React | 18.x | Existing |
| State/Server State | Redux Toolkit Query | 2.x | Existing |
| Routing | React Router | 6.x | Existing |
| Animations | Framer Motion | 10.x | Existing |
| Icons | Lucide React | Latest | Existing |
| Date | dayjs | Latest | Existing |

## 3. Component Design

### WalletScreen (src/screens/WalletScreen.tsx)
- **Purpose:** Main wallet screen
- **Responsibilities:** Orchestrates all sub-components, handles modal state
- **Dependencies:** `useWallet`, `useProfile`, `useEnigmaUI`, `StickyHeader`

### useWallet (src/services/wallet/hooks.tsx)
- **Purpose:** Encapsulates all wallet data fetching and mutations
- **Responsibilities:**
  - Fetch balance logs via `useGetBalanceLogsQuery`
  - Submit topup/withdrawal mutations
  - Provide loading states
- **Returns:** `{ balanceLogs, submitTopup, submitWithdrawal, isSubmittingTopup, isSubmittingWithdrawal }`

### walletApi (src/services/wallet/api.tsx)
- **Purpose:** RTK Query API definition
- **Endpoints:**
  - `getBalanceLogs` (query) → GET `/balance-log`
  - `createTopupRequest` (mutation) → POST `/topup-request`
  - `createWithdrawalRequest` (mutation) → POST `/withdrawal-request`

### Modal Components (inline in WalletScreen)
- **Topup Modal:** Form with currency input + textarea
- **Withdrawal Modal:** Form with currency input + textarea

## 4. Data Model

### Types (src/services/types/wallet.ts)
```typescript
interface BalanceLog {
  id: number;
  outlet_id: number;
  money: number;         // signed: positive=credit, negative=debit
  type: number;          // 1=topup, 2=withdrawal
  type_label: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  status: number;
  message: string;
  data: T[];
  error: string[];
  pagination: {
    limit: number;
    offset: number;
    has_next: boolean;
    total_pages: number;
    total_data: number;
  };
}
```

## 5. API Contracts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/balance-log` | Paginated balance logs |
| POST | `/topup-request` | Create topup request |
| POST | `/withdrawal-request` | Create withdrawal request |

### Request/Response Examples

**POST /topup-request**
```json
Request:
{
  "outlet_id": 10,
  "money": 500000,
  "description": "Topup for operations"
}
Response (201):
{
  "status": 201,
  "message": "success create topup request",
  "data": { "id": 15, "status": 1, "status_label": "created", ... }
}
```

**POST /withdrawal-request**
```json
Request:
{
  "outlet_id": 10,
  "money": 200000,
  "description": "Withdrawal for petty cash"
}
Response (201):
{
  "status": 201,
  "message": "success create withdrawal request",
  "data": { "id": 8, "status": 1, "status_label": "created", ... }
}
```

## 6. Security Considerations
- All requests authenticated via JWT (handled by `baseQuery`)
- Outlet-scoped access enforced by backend (user.outlet_id)
- Minimum amount validation (Rp 10.000) on client and server
- No sensitive data stored in Redux

## 7. Performance Strategy
- Balance logs paginated (limit=20)
- RTK Query caching (default 60s)
- No heavy re-renders (memoized callbacks)

## 8. Implementation Phases

- [ ] Phase 1: Types + API Service (`wallet/api.tsx`, `wallet/types.ts`)
- [ ] Phase 2: Hooks (`wallet/hooks.tsx`)
- [ ] Phase 3: WalletScreen UI with modals
- [ ] Phase 4: Register API in store (`reducer.tsx`)
- [ ] Phase 5: Add route + bottom menu entry
- [ ] Phase 6: Test & verify

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| API contract mismatch | High | Low | Verified against `specs/api-contract-franchise-financial.md` |
| Outlet ID type mismatch | Medium | Low | Parse string→number in hook |
| Modal UX issues | Low | Medium | Reuse proven logout modal pattern |

## 10. Open Questions
- [ ] Pagination UI for balance logs (infinite scroll vs load more)

## Next Steps
- Review plan
- Run `/tasks wallet-screen` to generate implementation tasks
- Run `/implement wallet-screen` to start building