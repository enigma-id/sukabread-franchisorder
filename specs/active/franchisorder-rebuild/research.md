# Research: Franchisorder Rebuild API & Patterns

**Task ID:** franchisorder-rebuild
**Date:** 2026-05-11
**Status:** Complete

---

## Executive Summary
This document maps the existing business logic and API contracts from the original `suka-bread/clients/web/franchisorder` project and aligns them with the elite service-layer patterns established in `franchisee-v2`.

---

## API Contract Mapping

### 1. Auth Domain
Original: `src/services/auth/service.js`
New: `src/services/auth/api.tsx`

| Original Method | Endpoint | New Endpoint Name |
|-----------------|----------|-------------------|
| `signin(payload)` | `POST /auth/signin` | `signin` |
| `seamless(payload)` | `POST /auth/seamless` | `seamless` |
| `initialize()` | `GET /auth/me` | `getMe` |

### 2. Catalog Domain
Original: `src/services/catalog/service.js`
New: `src/services/catalog/api.tsx`

| Original Method | Endpoint | New Endpoint Name |
|-----------------|----------|-------------------|
| `get(page, search)` | `GET /catalog` | `getCatalog` |
| `show(id)` | `GET /catalog/:id` | `showCatalog` |

### 3. Order Domain
Original: `src/services/order/service.js`
New: `src/services/order/api.tsx`

| Original Method | Endpoint | New Endpoint Name |
|-----------------|----------|-------------------|
| `get(status, page)` | `GET /order` | `getOrders` |
| `show(id)` | `GET /order/:id` | `showOrder` |
| `cancel(id, payload)` | `PUT /order/:id/cancel` | `cancelOrder` |
| `paymentMethod(id)` | `GET /order/:id/payment-method` | `getOrderPaymentMethod` |

### 4. Cart & Checkout Domain
Original: `src/services/cart/service.js`
New: `src/services/cart/api.tsx`

| Original Method | Endpoint | New Endpoint Name |
|-----------------|----------|-------------------|
| `checkout(payload)` | `POST /cart/checkout` | `checkout` |
| `fetchPaymentMethod()` | `GET /cart/payment-method` | `getPaymentMethods` |
| `fetchSchedule(items)` | `POST /cart/schedule` | `getSchedule` |

---

## Core Business Flows

### 1. App Bootstrap (`boot.js`)
1.  Check existing session via `GET /auth/me`.
2.  Parse URL for `username` query parameter.
3.  If `username` exists, perform seamless login:
    -   Token: `GMOH6YbLKhcOrBOW1iV4WZOIhnrC7dom`
    -   Dispatch `$signout` then `$seamless`.
4.  Signal app is ready via `App.$ready()`.
5.  Listen for `loggedin` event to start session tracking.

### 2. Checkout Logic
-   Item formatting: Convert cart items to `{ catalog_id, quantity }`.
-   Request payload: `items`, `payment_method`, `shipping_at` (YYYY-MM-DD).

---

## Pattern Alignment (Franchisee-v2)

### 1. Service Layer Structure
```
src/services/
├── [domain]/
│   ├── api.tsx     # RTK Query API
│   ├── slice.tsx   # Domain slice
│   └── hooks.tsx   # Custom hooks
├── baseQuery.tsx   # Common baseQuery with headers & logs
├── reducer.tsx     # Root reducer with signout handling
└── store.tsx       # Redux store config with persistence
```

### 2. BaseQuery Patterns
-   `prepareHeaders`: Inject Bearer token from `auth.session.token`.
-   `responseHandler`: Handle binary data (blob) for receipts/files.
-   Logging: `logger.apiRequest` and `logger.apiResponse`.
-   Global Auth Handling: Catch 401/403 and trigger `signout()`.

---

## Recommendations

1.  **Strict Typing:** Create TypeScript interfaces for all request/response objects based on the original JS code's data structures.
2.  **Modular Slices:** Keep the "current order" in a dedicated `orderSlice` (as in my initial implementation) but ensure it mirrors the `Cart` logic from the original project.
3.  **Boot Flow:** Implement the bootstrap logic in a separate service or high-level component that runs before the main app mount, mirroring `boot.js`.

---

*Research completed with SDD 2.0*
