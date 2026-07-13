# Technical Plan: API Contract Alignment

**Task ID:** api-contract
**Status:** Ready for Implementation
**Based on:** spec.md v1.1, research.md

---

## 1. System Architecture

```
┌──────────────────────────────────────────────────┐
│                  Frontend (React/RTK Query)       │
│                                                   │
│  ┌──────────────┐  ┌─────────────────────────┐   │
│  │ order/api.tsx │  │    OrderListScreen      │   │
│  │  (paths,      │  │  (status normalizer,    │   │
│  │   payloads)   │  │   field mappings)       │   │
│  └──────┬───────┘  └─────────┬───────────────┘   │
│         │                    │                    │
│         ▼                    ▼                    │
│  ┌─────────────────────────────────────────────┐  │
│  │          baseQuery.tsx                       │  │
│  │  (response unwrapping, auth header)          │  │
│  └─────────────────┬───────────────────────────┘  │
│                    │ HTTP                          │
└────────────────────┼──────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────┐
│           Backend (franchise-order)               │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │  SalesOrder Handler                          │  │
│  │  POST /sales/order      ✅ OK               │  │
│  │  GET  /sales/order      ✅ OK               │  │
│  │  GET  /sales/order/{id} ✅ OK               │  │
│  │  PUT  /sales/order/{id}/cancel  ✅ (note)    │  │
│  └─────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### Architecture Decision: Frontend Path Changes (not backend aliases)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Path alignment | Frontend changes to `/sales/order/*` | Backend is source of truth; frontend should match |
| Cancel field | Frontend sends `{note}` | `void_note` is backend response field, `note` is request |
| Payment method detail | Remove `/order/{id}/payment-method` call | Backend already embeds `payment_method` in order response |
| Status filter | Frontend sends `document_status` param | Backend already supports it; no change needed on backend |
| Retur workflow | No backend changes | Backend has CRUD; approval is external/nice-to-have |
| Region search | Keep external (not in handler) | Separate service handles it |

### Architecture Decision: Type Adaptation Layer

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Meta shape | Frontend `OrderResponse.meta` adapted to backend shape | Backend is stable; frontend adapter is simpler |
| Status values | Frontend normalizer maps backend → display | Backend uses canonical values (`published`, `process`, etc.) |
| Response envelope | Frontend uses backend `{success, message, data, errors, meta}` | baseQuery already handles this |

---

## 2. Technology Stack

Changes are **frontend-only** (TypeScript/React/RTK Query). No backend changes needed.

| Layer | Technology | Current | Target | Rationale |
|-------|-----------|---------|--------|-----------|
| API layer | RTK Query | `createApi` with `fetchBaseQuery` | Same + proper types | Only alignment changes |
| State | Redux Toolkit | Current | Same | No new state needed |
| Types | TypeScript | Missing `Order` type | New `Order` interface | Must match backend SalesOrder |
| Screens | React + framer-motion | Current | Same + field mapping fixes | No restyling needed |

---

## 3. Component Design

### 3.1 Type Definitions

**New file:** No new file — add to `src/services/types/api.ts`

**New interface: `Order`**
```typescript
export interface Order {
  id: string;
  franchisor_id: string;
  code: string;
  ref_code?: string;
  outlet_id: string;
  warehouse_id: string;
  warehouse_name?: string;
  order_type: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_region_id: string;
  payment_method_id: string;
  document_status: DocumentStatus;
  fulfillment_status: FulfillmentStatus;
  payment_status: PaymentStatus;
  subtotal_base: number;
  subtotal_gross: number;
  subtotal_tax: number;
  subtotal_taxed: number;
  subtotal_nett: number;
  shipping_charges: number;
  total_charges: number;
  shipping_date?: string;
  void_note?: string;
  note?: string;
  fulfilled_at?: string;
  paid_at?: string;
  payment_expired_at?: string;
  self_pickup: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  outlet?: any;
  region?: any;
  payment_method?: PaymentMethod;
  payment?: PaymentTransaction | null;
  items?: SalesOrderItem[];
}

export type DocumentStatus = 'published' | 'process' | 'completed' | 'cancelled';
export type FulfillmentStatus = 'new' | 'completed';
export type PaymentStatus = 'unpaid' | 'paid';

export interface PaymentTransaction {
  redirect_url?: string;
  qr_code?: string;
  status?: string;
  [key: string]: unknown;
}

export interface SalesOrderItem {
  id: string;
  catalog_id: string;
  item_id?: string;
  fraction_id?: string;
  parent_id?: string;
  quantity_ordered: number;
  quantity_fulfilled: number;
  unit_base: number;
  unit_nett: number;
  unit_gross: number;
  unit_tax: number;
  unit_taxed: number;
  bundle_id?: number;
  catalog?: { name: string };
  item?: { name: string };
}

export interface OrderResponse {
  data: Order[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
```

### 3.2 Status Normalizer

**New utility:** `src/utils/order-status.ts`

Pure function mapping backend status → frontend display values, icons, colors.

```typescript
export type OrderTabStatus = '' | 'pending' | 'completed' | 'canceled';
export type OrderDisplayStatus = 'pending' | 'active' | 'process' | 'completed' | 'finished' | 'canceled' | 'void';

export function normalizeOrderStatus(document_status: string, payment_status?: string): OrderDisplayStatus {
  // backend: published + unpaid → pending
  // backend: published + paid → active/process
  // backend: completed → finished/completed
  // backend: cancelled → canceled/void
  if (document_status === 'cancelled') return 'canceled';
  if (document_status === 'completed') return 'completed';
  if (document_status === 'published' && payment_status === 'paid') return 'active';
  if (document_status === 'published' && payment_status === 'unpaid') return 'pending';
  return document_status as OrderDisplayStatus;
}
```

### 3.3 Order API Service

**File:** `src/services/order/api.tsx`

Changes:
| Endpoint | Current URL | Target URL | Change |
|----------|------------|------------|--------|
| `getOrders` | `/order` | `/sales/order` | Path fix |
| `showOrder` | `/order/${id}` | `/sales/order/${id}` | Path fix |
| `cancelOrder` | `/order/${id}/cancel` | `/sales/order/${id}/cancel` | Path fix |
| `cancelOrder body` | `{void_note}` | `{note}` | Field fix |
| `getOrderPaymentMethod` | `/order/${id}/payment-method` | **REMOVED** | Doesn't exist on backend |

Additional changes:
- `OrderResponse.meta` uses backend shape (`page`, `page_size`, `total_pages`)
- `OrderParams` sends `document_status` not `status` (or maps in hook)
- Types reference proper `Order` from types/api

### 3.4 Order Hooks

**File:** `src/services/order/hooks.tsx`

Changes:
- Remove `paymentMethodQuery` (no more `useGetOrderPaymentMethodQuery`)
- `doCancelOrder` sends `{ note }` instead of `{ void_note }`
- Proper type annotations, remove `any`

### 3.5 OrderListScreen

**File:** `src/screens/OrderListScreen.tsx`

Changes:
| Current | Target | Type |
|---------|--------|------|
| `order.order_status` | `normalizeOrderStatus(order.document_status, order.payment_status)` | Function call |
| `order.total_bill` | `order.total_charges` | Field rename |
| `order.ordered_at` | `order.created_at` | Field rename |
| `meta.current_page` | `meta.page` | Field rename |
| `meta.last_page` | `meta.total_pages` | Field rename |
| `useOrder(params)` sends `status` | Send `document_status` mapped from `params.status` | Param mapping |
| `params.order_by: "-id"` | `params.order_by: "-sales_order:created_at"` | Default sort |
| `getStatusTheme(status)` receives frontend values | Receives normalized values from `normalizeOrderStatus` | Works as-is |

Status tab mapping:
| Tab | Frontend Param | Backend `document_status` |
|-----|---------------|--------------------------|
| All | `""` | omitted |
| Pending | `"pending"` | `"pending"` |
| Process | — | `"process"` |
| Completed | `"completed"` | `"completed"` |

### 3.6 OrderDetailScreen

**File:** `src/screens/OrderDetailScreen.tsx`

Changes:
| Current | Target | Type |
|---------|--------|------|
| `order.order_status` | `normalizeOrderStatus(order.document_status, order.payment_status)` | Function call |
| `order.total_bill` | `order.total_charges` | Field rename |
| `order.ordered_at` | `order.created_at` | Field rename |
| `order.delivery_status` | `order.fulfillment_status` | Field rename |
| `order.expedisi` | `order.warehouse_name || "Standard Shipping"` | Field rename + fallback |
| `order.bank.name` | `order.payment_method?.name` | Object path change |
| `order.bank.account_number` | `order.payment_method?.account_number` | Object path change |
| `order.bank.account_name` | `order.payment_method?.account_name` | Object path change |
| `order.payment_url` | `order.payment?.redirect_url` | Object path change |
| `order.is_payment_gateway` | Derived: `payment_method?.provider === 'qris' \|\| payment_method?.provider === 'midtrans'` | Computed value |
| `getStatusColor(status)` receives `order_status` | Receives normalized status | Works as-is |
| Remove `order.bank` conditional | Use `payment_method` or `payment?.redirect_url` | Conditional logic change |

### 3.7 Profile Screen

**File:** `src/screens/ProfileScreen.tsx`

Add a hook to call `GET /profile/me` to fetch fresh outlet data. Currently only reads from session.

**New file / add to existing:** Add profile API slice or reuse authApi.

Since there's no existing profile API file, add minimal profile endpoint to existing or create new slice. Simplest: add to `auth/api.tsx` or create `profile/api.tsx`.

### 3.8 Retur Service

**New file:** `src/services/retur/api.tsx`

Create RTK Query service for the 4 existing backend endpoints:
- `GET /sales/return` → list
- `POST /sales/return` → create
- `GET /sales/return/{id}` → detail
- `DELETE /sales/return/{id}` → cancel

No screens implementing retur UI — just API service + hooks for future use.

---

## 4. Data Model

### 4.1 Entity: Order (TypeScript)

See section 3.1 above for full interface. This maps 1:1 to backend `entity.SalesOrder`.

### 4.2 Status Value Mapping

| Backend `document_status` | Backend `payment_status` | Normalized Display | Tab Filter |
|--------------------------|------------------------|-------------------|------------|
| `published` | `unpaid` | `pending` | `pending` |
| `published` | `paid` | `active` / `process` | excluded |
| `completed` | `paid` | `completed` | `completed` |
| `cancelled` | any | `canceled` | `canceled` |
| (any other) | — | as-is | — |

### 4.3 Response Envelope Mapping

Frontend `baseQuery` response handler already returns raw JSON. The `OrderResponse.meta` will use backend shape `{page, page_size, total, total_pages, has_next, has_prev}` and screens will access appropriate fields.

---

## 5. API Contracts

### 5.1 Frontend → Backend (After Changes)

| Method | Frontend Path | Backend Path | Status | Notes |
|--------|--------------|--------------|--------|-------|
| POST | `/auth/login` | `/auth/login` | ✅ OK | No change |
| POST | `/auth/seamless` | `/auth/seamless` | ✅ OK | No change |
| GET | `/catalog` | `/catalog` | ✅ OK | No change |
| GET | `/catalog/{id}` | `/catalog/{id}` | ✅ OK | No change |
| POST | `/sales/order` | `/sales/order` | ✅ OK | No change |
| GET | `/payment/method` | `/payment/method` | ✅ OK | No change |
| GET | `/warehouse` | `/warehouse` | ✅ OK | No change |
| GET | `/regions/search` | external | ✅ OK | No change |
| GET | `/sales/order` | `/sales/order` | ✅ FIXED | Was `/order` |
| GET | `/sales/order/{id}` | `/sales/order/{id}` | ✅ FIXED | Was `/order/{id}` |
| PUT | `/sales/order/{id}/cancel` | `/sales/order/{id}/cancel` | ✅ FIXED | Was `/order/{id}/cancel` |
| — | ~~`/order/{id}/payment-method`~~ | ❌ REMOVED | ✅ FIXED | Payment method in order response |
| GET | `/profile/me` | `/profile/me` | ✅ NEW | Frontend now calls it |

### 5.2 Cancel Request (After Fix)

```typescript
// Before (broken):
cancelOrderMutation({ id, void_note: reason })
// → sends PUT /order/{id}/cancel { void_note: "reason" }

// After (fixed):
cancelOrderMutation({ id, note: reason })
// → sends PUT /sales/order/{id}/cancel { note: "reason" }
```

### 5.3 Order List Query Params

```typescript
// Before:
{ status: "pending", page: 1, limit: 10, order_by: "-id" }

// After:
{ document_status: "pending", page: 1, limit: 10, order_by: "-sales_order:created_at" }
```

---

## 6. Implementation Phases

### Phase 1: Critical Fixes (FR-1, FR-2, FR-10)

**Goal:** Make orders work end-to-end

| Task | Description | Est. |
|------|-------------|------|
| 1.1 | Create `Order` TypeScript interface in `types/api.ts` with SalesOrder shape | 15m |
| 1.2 | Fix `order/api.tsx`: paths → `/sales/order/*`, cancel body `{note}`, align meta shape | 20m |
| 1.3 | Remove `useGetOrderPaymentMethodQuery` from hooks and API | 10m |
| 1.4 | Update `order/hooks.tsx`: change `{void_note}` → `{note}`, remove payment hook | 10m |

### Phase 2: Screen Data Alignment (FR-11, FR-4)

**Goal:** Screens display correct data

| Task | Description | Est. |
|------|-------------|------|
| 2.1 | Create `src/utils/order-status.ts` normalizer fn | 15m |
| 2.2 | Fix `OrderListScreen`: field names, meta shape, status mapping, default sort | 30m |
| 2.3 | Fix `OrderDetailScreen`: field names, payment method object path, payment redirect, cancellation conditional | 45m |

### Phase 3: Missing Capabilities (FR-13, FR-14)

**Goal:** Profile fetches live data, retur API ready

| Task | Description | Est. |
|------|-------------|------|
| 3.1 | Create profile API slice or add to auth — call `GET /profile/me` | 20m |
| 3.2 | Update ProfileScreen to fetch outlet data from profile endpoint | 20m |
| 3.3 | Create retur API service + hooks (list/create/detail/cancel) | 25m |

### Phase 4: Cleanup & Polish

| Task | Description | Est. |
|------|-------------|------|
| 4.1 | Remove `as any` casts in order screens where Order type now applies | 15m |
| 4.2 | Verify all RTK Query endpoints have proper types (no implicit any) | 15m |
| 4.3 | Test: create order → list → detail → cancel flow | 15m |
| 4.4 | Test: checkout with saldo + non-saldo payment | 15m |

---

## 7. Security Considerations

| Concern | Status | Action |
|---------|--------|--------|
| Hardcoded seamless token | ✅ Keep as-is per user | No change |
| JWT in localStorage | ✅ Already handled | No change |
| Auth error → auto logout | ✅ In baseQuery | No change |
| Order ownership check | ✅ Backend enforces | No change |
| Outlet isolation | ✅ Backend filters by session | No change |

---

## 8. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Frontend sends wrong param after path change | High | Low | Type-safe refactor, test after each change |
| `baseQuery` responseHandler unwarps data and breaks expected shape | Medium | Medium | Read current handler — already passes raw JSON for non-legacy responses |
| Screens still reference old field names (missed during refactor) | Medium | Medium | Systematic search across all screen files |
| Status filter produces wrong results | High | Low | Match backend's `document_status` values precisely |
| `/order/{id}/payment-method` removal breaks something else | Medium | Low | Only used in `useOrderDetail` hook |

---

## 9. Open Questions

- [ ] Is the `baseQuery` responseHandler's `status === "success"` unwrapping still needed? It could strip the `{success, message, data}` envelope. (Verify after phase 1)

---

## Next Steps

1. Review this technical plan
2. Run `/tasks api-contract` to generate implementation tasks
3. Run `/implement api-contract` to start building

---

*Plan created with SDD 4.0*
