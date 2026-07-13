# Specification: API Contract Analysis — franchise-order

**Task ID:** api-contract
**Created:** 2026-07-10
**Status:** Ready for Planning
**Version:** 1.1

---

## 1. Problem Statement

- **The Problem:** The franchise-order backend API and the frontend (franchisorder-v2) are misaligned across endpoints, field names, response shapes, and missing capabilities. This causes integration failures, hardcoded workarounds, and blocks checkout/order-management flows.
- **Current Situation:** Frontend calls paths like `/order/*` and `/order/{id}/payment-method` that don't exist on the backend (which uses `/sales/order/*`). Cancel request sends `{void_note}` but backend expects `{note}` (`void_note` is a response field, not a request field). Pagination response shapes differ. Key order-management capabilities (payment status polling, retur workflow, outlet info) are missing entirely.
- **Desired Outcome:** A fully aligned API contract where frontend calls map 1:1 to backend endpoints with consistent payloads, responses, and behaviors. Additionally, the frontend `Order` TypeScript type (which is missing entirely) must be defined and aligned with the backend SalesOrder entity.

---

## 2. User Personas

### Primary User: Outlet Owner (Gerai)
- **Who:** Franchise outlet owners ordering raw materials
- **Goals:** Browse catalog, place orders, track order status, request returns, view payment info
- **Pain points:** Can't complete checkout because paths don't match, can't view payment details on order, cancel fails due to field name mismatch

### Secondary User: System Admin/Integrator
- **Who:** Developer maintaining the platform
- **Goals:** Clean API contracts, minimal workarounds, consistency
- **Pain points:** Mismatched field names, missing endpoints, inconsistent response shapes

---

## 3. Functional Requirements

### FR-1: Align Order Endpoint Paths

**Description:** The frontend uses `/order/*` but backend registers `/sales/order/*`. These must converge.

**User Story:**
> As a developer, I want the order API paths to be consistent between frontend and backend so that all order operations work without path rewrites.

**Acceptance Criteria:**
- [ ] Given the frontend calls `/order`, when the request is made, either the backend adds a route alias or the frontend changes to `/sales/order`
- [ ] Given the frontend calls `/order/{id}`, when the request is made, it maps to `GET /sales/order/{id}`
- [ ] Given the frontend calls `/order/{id}/cancel`, when the request is made, it maps to `PUT /sales/order/{id}/cancel`

**Priority:** Must Have

### FR-2: Fix Cancel Request Field Name

**Description:** Frontend sends `void_note` but backend expects `note`. Both the path (`/order/{id}/cancel` → `/sales/order/{id}/cancel`) and the field name need alignment.

**User Story:**
> As a developer, I want the cancel request body field name to be consistent so that cancellation doesn't fail silently.

**Acceptance Criteria:**
- [ ] Given a cancel request, when the frontend sends `{void_note: "reason"}`, the backend accepts it OR the frontend changes to `{note: "reason"}`
- [ ] Cancel response returns `{"success": true, "message": "Sales order cancelled successfully"}`

**Priority:** Must Have

### FR-3: Add Payment Method Detail Endpoint

**Description:** Frontend calls `/order/{id}/payment-method` which doesn't exist. The payment method is embedded in the SalesOrder response as `payment_method_id`, but the frontend needs the resolved name/account details.

**User Story:**
> As an outlet owner, I want to see which payment method I used for an order (including account details) so that I can make payments correctly.

**Acceptance Criteria:**
- [ ] `GET /sales/order/{id}` response includes the resolved `payment_method` object (already done — the entity has the relation)
- [ ] OR a dedicated `GET /sales/order/{id}/payment-method` endpoint returns the payment method details

**Priority:** Must Have

### FR-4: Add Order List Endpoint (Frontend-Compatible)

**Description:** Frontend uses `GET /order` with params `{status, page, limit, order_by}` but backend has `GET /sales/order` with `{page, limit, search, order_by, document_status}`. The `status` param and response meta shape don't match.

**User Story:**
> As an outlet owner, I want to filter my orders by status and see paginated results so that I can manage my orders efficiently.

**Acceptance Criteria:**
- [ ] `GET /sales/order` accepts a `status` query param that maps `pending`/`process`/`completed` to the `document_status` filter (already works partially)
- [ ] Response meta includes `current_page`, `last_page`, `per_page`, `total` to match frontend expectations, OR frontend adapts to `page`, `page_size`, `total_pages`, `has_next`, `has_prev`

**Priority:** Should Have

### FR-5: Remove Hardcoded Seamless Token

**Description:** The seamless auth endpoint validates against a hardcoded token string `"GMOH6YbLKhcOrBOW1iV4WZOIhnrC7dom"`.

**User Story:**
> As a security-conscious developer, I want the seamless token to be configurable or validated via a secure mechanism so that it's not exposed in source code.

**Acceptance Criteria:**
- [ ] The seamless token is loaded from environment variable or external config
- [ ] The hardcoded string is removed from source code

**Priority:** Must Have

### FR-6: Add Order Status Filter Enhancement

**Description:** The `document_status` query param currently maps to 3 composite states (`pending`, `process`, `completed`). Add a more intuitive `status` alias that works the same way.

**User Story:**
> As an outlet owner, I want to filter my orders by tab-based status (Pending, Process, Completed) so that I can quickly find orders by state.

**Acceptance Criteria:**
- [ ] `GET /sales/order?status=pending` returns orders with `document_status = 'published' AND payment_status = 'unpaid'`
- [ ] `GET /sales/order?status=process` returns orders with `document_status = 'published' AND payment_status = 'paid'`
- [ ] `GET /sales/order?status=completed` returns orders with `document_status = 'completed' AND payment_status = 'paid'`

**Priority:** Should Have

### FR-7: Add Outlet Info Endpoint

**Description:** No dedicated endpoint exists to fetch the current outlet's profile (name, address, region, balance).

**User Story:**
> As an outlet owner, I want to see my outlet information and balance so that I can manage my account and know my saldo.

**Acceptance Criteria:**
- [ ] `GET /outlet/me` returns the outlet associated with the current user's session
- [ ] Response includes `id`, `name`, `address`, `region`, `phone`, `balance` (if saldo available)
- [ ] Balance is fetched from franchise-service via gRPC

**Priority:** Should Have

### FR-8: Add Payment Gateway Redirect URL

**Description:** When using `qris` or `midtrans` payment methods, the frontend needs a redirect URL or QR code to complete payment.

**User Story:**
> As an outlet owner, I want to see the payment QR/URL after placing an order so that I can complete payment via Midtrans/QRIS.

**Acceptance Criteria:**
- [ ] `GET /sales/order/{id}` includes `payment` object with `redirect_url` or `qr_code` for qris/midtrans providers
- [ ] This is already partially implemented (calls `paymentGateway.GetPaymentByOrderID`)

**Priority:** Should Have

### FR-9: Add Retur Workflow Endpoints

**Description:** The retur system has CRUD but no approval/rejection workflow. The state machine starts at `pending` and only supports soft-delete. No transition to `approved` or `rejected`.

**User Story:**
> As an outlet owner, I want my return requests to be processed (approved/rejected) so that I can get refunds or replacements.

**Acceptance Criteria:**
- [ ] `PUT /sales/return/{id}/approve` transitions `document_status` to `approved`
- [ ] `PUT /sales/return/{id}/reject` transitions `document_status` to `rejected`
- [ ] Approval/rejection records the user and timestamp

**Priority:** Nice to Have

### FR-10: Frontend-Backend Type Alignment

**Description:** Frontend TypeScript types (`Order`, `OrderResponse`) assume different shapes than what the backend actually returns. **The `Order` interface is entirely missing from `src/services/types/api.ts`** despite being imported, forcing all screen components to treat orders as `any`.

**User Story:**
> As a developer, I want the frontend types to match backend responses so that TypeScript compilation succeeds without `as any` casts.

**Acceptance Criteria:**
- [ ] Create a proper `Order` interface in `src/services/types/` matching the backend SalesOrder entity fields
- [ ] Update `OrderResponse.meta` to match backend `{page, page_size, total, total_pages, has_next, has_prev}` OR transform in baseQuery
- [ ] Frontend `cancelOrder` mutation sends `{note}` or backend accepts `{void_note}`

**Priority:** Must Have

### FR-11: Align Order Response Field Names

**Description:** The frontend screens (OrderListScreen, OrderDetailScreen) reference fields like `order_status`, `total_bill`, `ordered_at`, `delivery_status`, `expedisi`, `bank`, `payment_url`, `is_payment_gateway` that don't exist or have different names in the backend SalesOrder response. The frontend also expects status values like `finished`, `pending`, `active`, `void`, `canceled` that don't match backend's `document_status` values (`published`, `process`, `completed`, `cancelled`).

**User Story:**
> As an outlet owner, I want order details to display correctly with proper status, total, dates, and payment info so that I can manage my orders.

**Acceptance Criteria:**
- [ ] `order.order_status` → either backend maps values or frontend normalizes backend's `document_status` to expected values
- [ ] `order.total_bill` → backend `total_charges` OR frontend reads correct field
- [ ] `order.ordered_at` → `created_at` mapping
- [ ] `order.delivery_status` → either removed from UI or populated from fulfillment_status
- [ ] `order.bank` → `payment_method` object (already in response) with `name`, `account_name`, `account_number`
- [ ] `order.payment_url` → `payment.redirect_url` (from payment-gateway gRPC, already partially implemented)
- [ ] Status filter tabs use backend-compatible values or transform layer added

**Priority:** Must Have

### FR-12: Add Regions Search Endpoint

**Description:** The checkout screen calls `GET /regions/search` which is not registered in franchise-order. This endpoint needs to be available for the region selection flow.

**User Story:**
> As an outlet owner, I want to select my shipping region during checkout so that I can place orders with correct delivery addresses.

**Acceptance Criteria:**
- [ ] `GET /regions/search` is available and returns region data matching `RegionDetail` frontend type
- [ ] This may be in a separate service (region-id) — frontend `baseUrl` may need to target the correct service

**Priority:** Must Have

### FR-13: Profile Screen API Integration

**Description:** The profile screen (`ProfileScreen.tsx`) only displays user info from the session state (auth slice). It never calls `GET /profile/me` which also returns associated outlet/region data. No outlet balance (saldo) is shown.

**User Story:**
> As an outlet owner, I want to see my outlet balance and profile information so that I can manage my account.

**Acceptance Criteria:**
- [ ] Profile screen calls `GET /profile/me` to fetch fresh user/outlet data
- [ ] Outlet balance is fetched (from franchise-service via gRPC on backend)
- [ ] Or a dedicated `/outlet/me` endpoint is created (see FR-7)

**Priority:** Should Have

### FR-14: Retur API Not Consumed by Frontend

**Description:** The backend has 4 retur endpoints (`GET /sales/return`, `POST /sales/return`, `GET /sales/return/{id}`, `DELETE /sales/return/{id}`) but the frontend has no retur API integration at all. No retur screens or mutations exist.

**User Story:**
> As an outlet owner, I want to submit return requests for completed orders so that I can get refunds or replacements.

**Acceptance Criteria:**
- [ ] Frontend implements retur API service (create/list/detail/cancel)
- [ ] Retur workflow UI is connected to backend endpoints

**Priority:** Should Have

### FR-15: Add Order Status Polling Endpoint

**Description:** There is no dedicated endpoint to poll for order payment status changes. The frontend currently relies on `GET /order/{id}/payment-method` which doesn't exist, and there's no lightweight status-check endpoint.

**User Story:**
> As an outlet owner, I want to see real-time payment status updates so that I know when my payment is confirmed.

**Acceptance Criteria:**
- [ ] Add `GET /sales/order/{id}/payment-status` returning `{payment_status, paid_at, payment_expired_at}`
- [ ] OR embed `payment` object with redirect_url in the existing `GET /sales/order/{id}` response (already partially done)

**Priority:** Nice to Have

---

## 4. Non-Functional Requirements

- **Security:** Hardcoded secrets must be eliminated (FR-5)
- **Consistency:** All endpoints follow the same response envelope `{success, message, data, errors, meta}`
- **Backward Compatibility:** Existing API consumers should not break — prefer additive changes (add `status` alias, keep `document_status`)
- **Observability:** All gRPC call failures should be logged with context

---

## 5. Out of Scope

- ❌ Building a full admin dashboard — this spec covers only the existing franchise-order service alignment
- ❌ Adding B2B ordering or multi-tenant support — current single-franchisor model is sufficient
- ❌ Rewriting the frontend order service — only minimal alignment changes
- ❌ Payment gateway webhook handling — that's a separate concern in payment-gateway service

---

## 6. Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Frontend on old version calls `/order/{id}` | Backend should support both paths during transition, or frontend must update first |
| Cancel request with `void_note` instead of `note` | Backend accepts both field names temporarily, or clear error message |
| Payment method on order is deleted/unavailable | `GET /sales/order/{id}` returns `payment_method: null`, frontend handles gracefully |
| Seamless token leaked in source code | Immediately rotate via environment variable, revoke old token |
| Outlet has no saldo balance | `POST /sales/order` with saldo payment returns clear `"saldo tidak cukup"` error |

| Error | User Message | System Action |
|-------|--------------|---------------|
| Cancel paid order | "Cannot cancel a paid sales order" | Reject with 4xx |
| Cancel already-cancelled order | "Sales order is already cancelled" | Reject with 4xx |
| View another outlet's order | "Unauthorized: sales order does not belong to your outlet" | Reject with 401 |
| Return from unfulfilled order | "Cannot return items from an uncompleted order" | Reject with 4xx |

---

## 7. Frontend-Backend Gap Analysis

### Path Mismatches (Frontend API Calls vs Backend)

| # | Frontend Call | Backend Actual | Status | Impact |
|---|--------------|----------------|--------|--------|
| 1 | `POST /auth/login` | `POST /auth/login` | ✅ OK | — |
| 2 | `POST /auth/seamless` | `POST /auth/seamless` | ✅ OK (hardcoded token) | Security risk (FR-5) |
| 3 | `GET /catalog` | `GET /catalog` | ✅ OK | — |
| 4 | `GET /catalog/{id}` | `GET /catalog/{id}` | ✅ OK | — |
| 5 | `POST /sales/order` | `POST /sales/order` | ✅ OK | — |
| 6 | `GET /payment/method` | `GET /payment/method` | ✅ OK | — |
| 7 | `GET /warehouse` | `GET /warehouse` | ✅ OK | — |
| 8 | `GET /regions/search` | ❌ NOT FOUND | 🔴 MISSING | Checkout can't resolve region |
| 9 | `GET /order` | `GET /sales/order` | ❌ PATH | Orders list broken |
| 10 | `GET /order/{id}` | `GET /sales/order/{id}` | ❌ PATH | Order detail broken |
| 11 | `PUT /order/{id}/cancel` | `PUT /sales/order/{id}/cancel` | ❌ PATH + FIELD | Cancel fails |
| 12 | `GET /order/{id}/payment-method` | ❌ NOT FOUND | 🔴 MISSING | Payment info missing |
| 13 | `GET /profile/me` | `GET /profile/me` | ✅ UNUSED | Frontend never calls it |

### Response Field Name Mismatches

**Critical: `Order` TypeScript type is missing entirely** — `src/services/order/api.tsx:3` imports `Order` from `../types/api` but it's never defined there or anywhere. All screens access `order.X` as implicit `any`.

| Screen | Frontend Field | Backend Field | Issue |
|--------|---------------|---------------|-------|
| OrderListScreen | `order.order_status` | `document_status` | Wrong value — frontend expects `finished/pending/active/void/canceled`, backend returns `published/process/completed/cancelled` |
| OrderListScreen | `order.total_bill` | `total_charges` | Key mismatch |
| OrderListScreen | `order.ordered_at` | `created_at` | Key mismatch |
| OrderDetailScreen | `order.order_status` | `document_status` | Same as above |
| OrderDetailScreen | `order.total_bill` | `total_charges` | Same as above |
| OrderDetailScreen | `order.ordered_at` | `created_at` | Same as above |
| OrderDetailScreen | `order.delivery_status` | ❌ doesn't exist | Always undefined |
| OrderDetailScreen | `order.expedisi` | ❌ doesn't exist | Always undefined |
| OrderDetailScreen | `order.bank.name` | `payment_method.name` | Different object shape |
| OrderDetailScreen | `order.bank.account_number` | `payment_method.account_number` | Nested under `payment_method` |
| OrderDetailScreen | `order.bank.account_name` | `payment_method.account_name` | Same |
| OrderDetailScreen | `order.payment_url` | `payment.redirect_url` | From gRPC payment-gateway |
| OrderDetailScreen | `order.is_payment_gateway` | ❌ derived | Not in backend entity |
| OrderDetailScreen | `order.payment_expired_at` | `payment_expired_at` | ✅ OK |
| OrderDetailScreen | `order.subtotal_gross` | `subtotal_gross` | ✅ OK |
| OrderDetailScreen | `order.shipping_charges` | `shipping_charges` | ✅ OK |
| OrderDetailScreen | `order.code` | `code` | ✅ OK |
| OrderDetailScreen | `order.items` | `items` | ✅ OK |

### Pagination Meta Shape Mismatch

| Frontend `OrderResponse.meta` | Backend `meta` |
|-------------------------------|----------------|
| `current_page: number` | `page: number` |
| `last_page: number` | `total_pages: number` |
| `per_page: number` | `page_size: number` |
| `total: number` | `total: number` ✅ |
| — | `has_next: bool` (unused) |
| — | `has_prev: bool` (unused) |

### Cancel Request Body Mismatch

| Frontend Sends | Backend Expects |
|---------------|-----------------|
| `{ void_note: "reason" }` | `{ note: "reason" }` |

### Filter Query Param Mismatch

| Frontend Sends | Backend Expects |
|---------------|-----------------|
| `status=pending\|completed\|canceled` | `document_status=pending\|process\|completed` |

### Missing Capabilities

- No `/regions/search` endpoint (consumed by checkout)
- No `/outlet/me` or outlet profile endpoint (ProfileScreen only uses session data)
- No retur approval/rejection workflow
- No explicit order payment status polling endpoint
- No frontend API integration for retur endpoints (not used at all)

---

## 8. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Frontend-backend path alignment | 100% | No `as any` casts or path rewrites in API layer |
| Cancel flow works end-to-end | 100% | Test: create → cancel → verify status |
| Checkout completes for all payment methods | 100% | Test: saldo + non-saldo payment |
| Order detail shows payment info | 100% | Verify payment_method and payment objects in response |
| No hardcoded secrets in source | 0 secrets | `grep` for hardcoded tokens |

---

## 9. Open Questions

- [ ] Is there an API gateway that rewrites `/order` → `/sales/order`? If so, FR-1 might be a gateway config change, not backend change.
- [ ] Where is `/regions/search` served from? The region-id library or a separate service?
- [ ] Who manages the retur approval workflow? Is it in another service or planned for future?
- [ ] Should `shipping_charges` be set at order creation or externally?
- [ ] What is the `RefCode` field intended for?

---

## 10. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-07-10 | Expanded gap analysis: frontend field name audit, Order type missing, 5 new FRs added |
| 1.0 | 2026-07-10 | Initial specification — API contract gap analysis |

## Next Steps

1. Review gap analysis with stakeholders
2. Resolve open questions (especially gateway existence)
3. Run `/plan api-contract` to create technical implementation plan
4. Prioritize: FR-1 (path alignment), FR-2 (cancel field), FR-5 (hardcoded token) are critical

---

*Specification created with SDD 4.0*
