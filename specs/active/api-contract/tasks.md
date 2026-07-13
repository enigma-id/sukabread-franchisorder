# Implementation Tasks: API Contract Alignment

**Task ID:** api-contract
**Created:** 2026-07-10
**Status:** Ready for Implementation

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 13 |
| Estimated Effort | ~4.5 hours |
| Phases | 4 |

---

## Phase 1: Critical Fixes

**Goal:** Make orders work end-to-end — fix paths, cancel body, define missing `Order` type.

Dependencies: None (Phase 1 is prerequisite for all other phases).

### Task 1.1: Define `Order` TypeScript Interface

**Description:** Create the `Order` interface matching backend `entity.SalesOrder` in `src/services/types/api.ts`. Include all sub-types: `DocumentStatus`, `FulfillmentStatus`, `PaymentStatus`, `PaymentTransaction`, `SalesOrderItem`, and `OrderResponse` with backend meta shape (`page`, `page_size`, `total`, `total_pages`, `has_next`, `has_prev`).

**Acceptance Criteria:**
- [ ] `Order` interface exists in `types/api.ts` with all SalesOrder fields
- [ ] `OrderResponse` uses backend meta shape (not frontend `current_page`/`last_page`)
- [ ] `PaymentTransaction` interface has `redirect_url`, `qr_code`, `status`
- [ ] `SalesOrderItem` interface has catalog/item name references
- [ ] TypeScript compilation passes with no errors from `Order` type usage

**Effort:** 20 minutes
**Priority:** High
**Dependencies:** None

---

### Task 1.2: Fix Order API Paths and Payloads

**Description:** Update `src/services/order/api.tsx`:
- Change `getOrders` URL from `/order` → `/sales/order`
- Change `showOrder` URL from `/order/${id}` → `/sales/order/${id}`
- Change `cancelOrder` URL from `/order/${id}/cancel` → `/sales/order/${id}/cancel`
- Change `cancelOrder` body from `{void_note}` → `{note}`
- Remove `getOrderPaymentMethod` endpoint entirely (doesn't exist on backend)
- Update `OrderResponse` meta to use backend shape (as defined in Task 1.1)
- Update exports — remove `useGetOrderPaymentMethodQuery`

**Acceptance Criteria:**
- [ ] All 3 order endpoints point to `/sales/order/*`
- [ ] Cancel request sends `{note: "reason"}` not `{void_note: "reason"}`
- [ ] `useGetOrderPaymentMethodQuery` removed from exports and API
- [ ] `OrderResponse` returns proper type instead of inline meta shape

**Effort:** 20 minutes
**Priority:** High
**Dependencies:** Task 1.1 (Order type needed for OrderResponse)

---

### Task 1.3: Update Order Hooks

**Description:** Update `src/services/order/hooks.tsx`:
- Remove `paymentMethodQuery` and `useGetOrderPaymentMethodQuery` import
- Change `doCancelOrder` to send `{note}` instead of `{void_note}`
- Remove `paymentMethodQuery` from return object
- Update type annotations (remove `any` where possible)

**Acceptance Criteria:**
- [ ] `doCancelOrder(id, note)` sends `{note}` in request body
- [ ] No reference to `useGetOrderPaymentMethodQuery` in hooks
- [ ] Hooks return object no longer includes `paymentMethodQuery`

**Effort:** 10 minutes
**Priority:** High
**Dependencies:** Task 1.2

---

## Phase 2: Screen Data Alignment

**Goal:** Screens display correct order data with proper field names and status values.

Dependencies: Phase 1 must be complete (types + API paths fixed).

### Task 2.1: Create Status Normalizer Utility

**Description:** Create `src/utils/order-status.ts` with:
- `normalizeOrderStatus(doc_status, payment_status?)` — maps backend values to frontend display
- Mapping: `published+unpaid→pending`, `published+paid→active`, `completed→completed`, `cancelled→canceled`
- Type exports for `OrderDisplayStatus`, `OrderTabStatus`

**Acceptance Criteria:**
- [ ] `normalizeOrderStatus` returns correct display values for all backend combinations
- [ ] Fallthrough returns input string for unknown values
- [ ] Unit-testable pure function (no side effects)

**Effort:** 15 minutes
**Priority:** High
**Dependencies:** Task 1.1

---

### Task 2.2: Fix OrderListScreen

**Description:** Update `src/screens/OrderListScreen.tsx`:
- Replace `order.order_status` → `normalizeOrderStatus(order.document_status, order.payment_status)`
- Replace `order.total_bill` → `order.total_charges`
- Replace `order.ordered_at` → `order.created_at`
- Replace `meta.current_page` → `meta.page`
- Replace `meta.last_page` → `meta.total_pages`
- Change default `order_by` from `"-id"` → `"-sales_order:created_at"`
- Map `params.status` → backend `document_status` values when sending to API

**Acceptance Criteria:**
- [ ] Order list renders with correct field values from backend
- [ ] Status badges display normalized values via `normalizeOrderStatus`
- [ ] Pagination reads `meta.page` and `meta.total_pages`
- [ ] Status tabs map correctly to backend filter values
- [ ] Default sort matches backend default

**Effort:** 30 minutes
**Priority:** High
**Dependencies:** Task 1.1, Task 1.2, Task 2.1

---

### Task 2.3: Fix OrderDetailScreen

**Description:** Update `src/screens/OrderDetailScreen.tsx`:

| Field | Current | Target |
|-------|---------|--------|
| `order.order_status` | `order.order_status` | `normalizeOrderStatus(order.document_status, order.payment_status)` |
| `order.total_bill` | `order.total_bill` | `order.total_charges` |
| `order.ordered_at` | — | `order.created_at` |
| `order.delivery_status` | — | `order.fulfillment_status` |
| `order.expedisi` | — | `order.warehouse_name` or `"Standard Shipping"` |
| `order.bank.name` | — | `order.payment_method?.name` |
| `order.bank.account_number` | — | `order.payment_method?.account_number` |
| `order.bank.account_name` | — | `order.payment_method?.account_name` |
| `order.payment_url` | — | `order.payment?.redirect_url` |
| `order.is_payment_gateway` | — | Derived: `provider === 'qris' \|\| provider === 'midtrans'` |
| `order.bank` conditional | `order.bank \|\| order.payment_url` | `order.payment_method \|\| order.payment?.redirect_url` |

**Acceptance Criteria:**
- [ ] All field references point to correct backend fields
- [ ] Payment method details render from `payment_method` object, not `bank`
- [ ] Payment gateway detection uses `provider` field, not `is_payment_gateway`
- [ ] Payment redirect URL reads from `payment.redirect_url`
- [ ] Fulfillment status shown instead of non-existent `delivery_status`
- [ ] Expedition/warehouse shows `warehouse_name`
- [ ] Cancel button visibility uses normalized `pending` status
- [ ] TypeScript compilation passes

**Effort:** 45 minutes
**Priority:** High
**Dependencies:** Task 1.1, Task 1.2, Task 2.1

---

## Phase 3: Missing Capabilities

**Goal:** Profile screen fetches live data, retur API service available for future use.

Dependencies: Phase 1 complete (API patterns established).

### Task 3.1: Create Profile API Integration

**Description:**
- Add `GET /profile/me` endpoint — either add to `auth/api.tsx` or create new `profile/api.tsx`
- Create `useProfileQuery` hook
- Define return type matching backend user + outlet data

**Acceptance Criteria:**
- [ ] Profile endpoint calls `GET /profile/me` on mount
- [ ] Hook returns typed response

**Effort:** 20 minutes
**Priority:** Medium
**Dependencies:** Task 1.1

---

### Task 3.2: Update ProfileScreen

**Description:** Update `src/screens/ProfileScreen.tsx` to consume the profile API:
- Call `useProfileQuery` on mount
- Display outlet info (name, address) alongside user info
- (Balance display optional — requires FR-7 or gRPC integration)

**Acceptance Criteria:**
- [ ] Profile screen fetches fresh data from backend (not just session)
- [ ] Outlet info rendered when available
- [ ] Graceful fallback if profile endpoint fails (shows session data)

**Effort:** 20 minutes
**Priority:** Medium
**Dependencies:** Task 3.1

---

### Task 3.3: Create Retur API Service

**Description:** Create `src/services/retur/api.tsx` and `src/services/retur/hooks.tsx`:
- `GET /sales/return` with pagination params
- `POST /sales/return` with sales_order_id, notes, items[]
- `GET /sales/return/{id}` with items
- `DELETE /sales/return/{id}` soft-delete
- Define `Retur`, `ReturItem`, `ReturResponse`, `CreateReturPayload` types

**Acceptance Criteria:**
- [ ] All 4 retur endpoints defined with proper types
- [ ] Hooks exported for all endpoints
- [ ] Payload types match backend expectations

**Effort:** 25 minutes
**Priority:** Medium
**Dependencies:** Task 1.1 (Order type reference)

---

## Phase 4: Cleanup & Polish

**Goal:** Ensure quality, remove workarounds, verify flow.

### Task 4.1: Remove `as any` Casts in Order Screens

**Description:** Replace `as any` casts in `OrderListScreen` and `OrderDetailScreen` with proper `Order` type annotations where the new type definitions make this possible.

**Acceptance Criteria:**
- [ ] Order list `order` parameter typed as `Order` instead of `any`
- [ ] Order detail `item` parameter typed as `SalesOrderItem` instead of `any`
- [ ] Compilation passes

**Effort:** 15 minutes
**Priority:** Medium
**Dependencies:** Task 2.2, Task 2.3

---

### Task 4.2: End-to-End Order Flow Test

**Description:** Verify the complete flow:
1. Checkout → creates order
2. Order list → displays with correct fields
3. Order detail → all sections render correctly
4. Cancel → works with `{note}` payload

**Acceptance Criteria:**
- [ ] Checkout completes without API errors
- [ ] Order list shows correct status, total, date
- [ ] Order detail shows all sections properly
- [ ] Cancel succeeds

**Effort:** 20 minutes
**Priority:** High
**Dependencies:** All Phase 1 + 2 tasks

---

## Quick Reference Checklist

- [ ] **1.1** Define `Order` TypeScript interface
- [ ] **1.2** Fix order API paths and payloads
- [ ] **1.3** Update order hooks
- [ ] **2.1** Create status normalizer utility
- [ ] **2.2** Fix OrderListScreen
- [ ] **2.3** Fix OrderDetailScreen
- [ ] **3.1** Create profile API integration
- [ ] **3.2** Update ProfileScreen
- [ ] **3.3** Create retur API service
- [ ] **4.1** Remove `as any` casts
- [ ] **4.2** End-to-end order flow test

---

## Dependency Graph

```
Phase 1                    Phase 2                  Phase 3           Phase 4
─────────                  ─────────                ─────────          ─────────
1.1 Order Type ──────┬──→ 2.1 Normalizer ──┬──→ 2.2 ListScreen ──→ 4.1 Remove any
                     │                     │                               │
1.2 API Paths ───────┤                     └──→ 2.3 DetailScreen ──→ 4.2 E2E Test
         │           │
1.3 Hooks ───────────┘
                     │
                      └──→ 3.1 Profile API ──→ 3.2 ProfileScreen
                      └──→ 3.3 Retur API
```

---

## Next Steps

1. Review task breakdown
2. Run `/implement api-contract` to start execution

---

*Tasks created with SDD 4.0*
