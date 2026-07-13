# Research: API Contract — franchise-order Backend

**Task ID:** api-contract
**Date:** 2026-07-10
**Status:** Complete

---

## Executive Summary

The franchise-order service exposes **13 REST endpoints** across **7 resource groups**: Auth, Catalog, Payment Method, Profile, Sales Order, Sales Return, and Warehouse. All authenticated endpoints use JWT claims injected via `FranchiseOrderSessionClaims` (UserID, Username, DisplayName, FranchisorID, OutletID). The standard response envelope is `{success, message, data, errors, meta}`. Two persistent state machines exist: **SalesOrder** (document_status × payment_status × fulfillment_status) and **Retur** (document_status).

---

## Standard Response Envelope

All endpoints respond with `rest.ResponseBody`:

```json
{
  "success": false,
  "message": "",
  "data": null,
  "errors": null,
  "meta": {
    "page": 1,
    "page_size": 25,
    "total": 0,
    "total_pages": 0,
    "has_next": false,
    "has_prev": false
  }
}
```

- `success` is `false` by default (Go zero-value bool). Only `NewResponseMessage` sets it `true`.
- `meta` only present on paginated list endpoints.
- `data` is a single object on detail/create, or an array on list, or omitted on message-only.

---

## Standard Pagination Query Params

Embedded from `common.QueryOption` on all list endpoints:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int64 | `1` | Page number |
| `limit` | int64 | `25` | Items per page |
| `search` | string | — | Search keyword |
| `order_by` | string | varies | Sort expression, e.g. `-field` for DESC, `+field` for ASC |

---

## JWT Session Claims

```go
type FranchiseOrderSessionClaims struct {
  // From common.SessionClaims:
  UserID      string
  Username    string
  DisplayName string
  // Custom:
  FranchisorID uuid.UUID  `json:"franchisor_id"`
  OutletID     uuid.UUID  `json:"outlet_id"`
}
```

All restricted endpoints require `Authorization: Bearer <access_token>`.

---

## 1. Auth

### 1.1 POST /auth/login

**Auth:** None (`s.WithAuth(false)`)

**Request Body:**
```json
{
  "identifier": "string (required)",
  "password": "string (required)"
}
```

**Validation:**
- `identifier` must match `users.username` (case-insensitive)
- User must have `is_active = true`
- Password must match bcrypt hash
- Error message (unified): `"invalid username or password"`

**Response 200:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "franchisor_id": "uuid",
      "usergroup_id": "uuid",
      "outlet_id": "uuid",
      "username": "string",
      "name": "string",
      "is_active": true,
      "last_activity_at": "datetime|null",
      "created_at": "datetime",
      "updated_at": "datetime",
      "fractions": null
    },
    "access_token": "string (JWT)",
    "refresh_token": "string (JWT, omitempty)"
  }
}
```
*Note: `password` is excluded from JSON via `json:"-"` tag.*

---

### 1.2 POST /auth/seamless

**Auth:** None (`s.WithAuth(false)`)

**Request Body:**
```json
{
  "identifier": "string (required)",
  "token": "string (required)"
}
```

**Validation:**
- `identifier` must match `users.username` (case-insensitive)
- User must have `is_active = true`
- `token` must equal hardcoded secret: `"GMOH6YbLKhcOrBOW1iV4WZOIhnrC7dom"`
- Error (token): `"authorization token not valid"`

**Response 200:** Same Session object as login.

---

## 2. Catalog

### 2.1 GET /catalog

**Auth:** Restricted

**Query Params:** Standard pagination (page, limit, search, order_by)
- Default order: `-catalog:created_at`

**Business Filtering:**
- Filters by `franchisor_id` from session claims
- Joins `catalog_outlet_type` filtered by outlet's `outlet_type_id`
- Only: `is_deleted = false AND is_active = true`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "franchisor_id": "uuid",
      "code": "string",
      "name": "string",
      "is_bundle": false,
      "item_id": "uuid|null",
      "fraction_id": "uuid|null",
      "base_price": 0.0,
      "unit_price": 0.0,
      "weight": 0.0,
      "volume": 0.0,
      "measurement": "string",
      "unit": 1.0,
      "is_active": true,
      "is_vatable": false,
      "created_by": "string",
      "updated_by": "string",
      "created_at": "datetime",
      "updated_at": "datetime",
      "item": { /* Item object - optional */ },
      "item_fraction": { /* ItemFraction object - optional */ },
      "bundle_items": [ /* CatalogBundle[] - optional */ ]
    }
  ],
  "meta": { /* pagination */ }
}
```

### 2.2 GET /catalog/{id}

**Auth:** Restricted

**Path Params:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | uuid | Catalog ID |

**Response 200:** Single Catalog object (same shape as list item, bundles preloaded via `FindByCatalog`).

---

## 3. Payment Method

### 3.1 GET /payment/method

**Auth:** Restricted

**Query Params:** Standard pagination
- Default order: `-payment_method:created_at`

**Business Filtering:**
- `franchisor_id` from session
- `type = 'franchise'`
- `is_active = true AND is_deleted = false`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "franchisor_id": "uuid",
      "name": "string",
      "provider": "string",     // cash|manual|midtrans|qris|other
      "type": "string",          // pos|franchise
      "account_name": "string",
      "account_number": "string",
      "is_member_payment": false,
      "is_active": true,
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ],
  "meta": { /* pagination */ }
}
```

---

## 4. Profile

### 4.1 GET /profile/me

**Auth:** Restricted

**Query Params:** None

**Response 200:** Single User object (same shape as login's `user` field, with associated outlet/region).

---

## 5. Sales Order

### 5.1 GET /sales/order

**Auth:** Restricted

**Query Params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int64 | 1 | Page |
| `limit` | int64 | 25 | Per page |
| `search` | string | — | Search keyword |
| `order_by` | string | `-sales_order:created_at` | Sort |
| `document_status` | string | — | Filter shortcut |

**`document_status` filter mapping:**

| Value | SQL WHERE |
|-------|-----------|
| `pending` | `document_status = 'published' AND payment_status = 'unpaid'` |
| `process` | `document_status = 'published' AND payment_status = 'paid'` |
| `completed` | `document_status = 'completed' AND payment_status = 'paid'` |

**Additional filters:** `outlet_id = session.OutletID`, `is_deleted = false`.

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "franchisor_id": "uuid",
      "code": "string",
      "ref_code": "string",
      "outlet_id": "uuid",
      "warehouse_id": "uuid",
      "warehouse_name": "string",
      "order_type": "string",
      "recipient_name": "string",
      "recipient_phone": "string",
      "recipient_address": "string",
      "recipient_region_id": "uuid",
      "payment_method_id": "uuid",
      "document_status": "string",
      "fulfillment_status": "string",
      "payment_status": "string",
      "subtotal_base": 0.0,
      "subtotal_gross": 0.0,
      "subtotal_tax": 0.0,
      "subtotal_taxed": 0.0,
      "subtotal_nett": 0.0,
      "shipping_charges": 0.0,
      "total_charges": 0.0,
      "shipping_date": "datetime",
      "void_note": "string",
      "note": "string",
      "fulfilled_at": "datetime",
      "paid_at": "datetime",
      "payment_expired_at": "datetime",
      "self_pickup": false,
      "created_by": "string",
      "updated_by": "string",
      "created_at": "datetime",
      "updated_at": "datetime",
      "outlet": { /* Outlet - optional */ },
      "region": { /* Region - optional */ },
      "payment_method": { /* PaymentMethod - optional */ },
      "payment": null,
      "items": null
    }
  ],
  "meta": { /* pagination */ }
}
```

---

### 5.2 POST /sales/order

**Auth:** Restricted

**Request Body:**
```json
{
  "warehouse_id": "uuid (optional if self_pickup=true)",
  "ref_code": "string (optional)",
  "payment_method_id": "uuid (required)",
  "recipient_name": "string (required)",
  "recipient_phone": "string (required)",
  "recipient_address": "string (required)",
  "recipient_region_id": "uuid (required)",
  "shipping_date": "string (optional, format YYYY-MM-DD)",
  "self_pickup": false,
  "note": "string (optional)",
  "items": [
    {
      "catalog_id": "uuid (required)",
      "quantity_ordered": 0.0 (required, > 0)
    }
  ]
}
```

**Validation Rules:**
- `payment_method_id`: Must exist and be active
- `self_pickup = false` AND `warehouse_id` empty → error `"warehouse is required"`
- `recipient_phone`: Validated + formatted via `validate.ValidPhone`
- `shipping_date`: Must be `YYYY-MM-DD` format
- `recipient_region_id`: Must exist in region-id service
- Items:
  - No duplicate `catalog_id`
  - Each `catalog_id` must exist in catalog, and be eligible for this outlet's type
  - `quantity_ordered` must be > 0
- **Saldo payment check** (if `payment_method.provider == "saldo"`):
  - Outlet balance must be >= estimated total (SUM of `unit_nett * quantity_ordered`)
  - Error: `"saldo outlet tidak cukup: {balance} < {total}"`

**Pricing Calculation (per item):**
```
unit_base   = catalog.base_price
unit_nett   = catalog.unit_price
unit_gross  = catalog.unit_price
IF catalog.is_vatable:
    unit_gross = unit_nett / 1.1
    unit_taxed = unit_gross
    unit_tax   = unit_taxed * 0.1
```

**Entity Construction:**
- `code`: Auto-generated `"SO-" + random(8, alphanumeric)`
- `order_type`: Always `"outlet"`
- `document_status`: `"published"` (default), or `"process"` if saldo
- `fulfillment_status`: Always `"new"`
- `payment_status`: `"unpaid"` (default), or `"paid"` if saldo
- If saldo: `paid_at` set to `time.Now()`

**Bundle Expansion:**
If `catalog.is_bundle == true`, for each bundle item:
- Creates child `SalesOrderItem` with `parent_id` pointing to parent
- `quantity_ordered` = parent_qty × bundle_item.quantity
- `unit_nett` = parent_unit_nett / bundle_item.quantity

**Post-Create Side Effects:**
1. `RecalculateByOrderID` — updates subtotal/total aggregates in DB
2. If saldo payment: calls `franchiseSvc.DebitOutletBalance` (gRPC)
3. Publishes RabbitMQ event: `"franchise_order:sales.order.created"`

**Response 201:** Created SalesOrder object (post-recalculation, with items and payment_method).

---

### 5.3 GET /sales/order/{id}

**Auth:** Restricted

**Path Params:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | uuid | Sales Order ID |

**Ownership Check:** `data.outlet_id != session.OutletID` → `401 "unauthorized: sales order does not belong to your outlet"`

**Enrichment:**
- Items preloaded via `FindByOrderID`
- If `payment_method.provider == "qris"` or `"midtrans"`: fetches `PaymentTransaction` from payment-gateway (gRPC) and attaches to `payment` field

**Response 200:** Single SalesOrder with `items[]` and optionally `payment`.

---

### 5.4 PUT /sales/order/{id}/cancel

**Auth:** Restricted

**Path Params:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | uuid | Sales Order ID (from `param:"id"`) |

**Request Body:**
```json
{
  "note": "string (required)"
}
```

**Validation:**
- SO must exist
- `payment_status` must be `"unpaid"` → error `"cannot cancel a paid sales order"`
- `document_status` must NOT be `"cancelled"` → error `"sales order is already cancelled"`

**Mutation:**
```
document_status = "cancelled"
void_note       = note
updated_at      = now
updated_by      = session.DisplayName
```

**Response 200:**
```json
{
  "message": "Sales order cancelled successfully",
  "success": true
}
```

---

## 6. Sales Return (Retur)

### 6.1 GET /sales/return

**Auth:** Restricted

**Query Params:** Standard pagination
- Default order: `-retur:created_at`

**Business Filtering:**
- JOIN `sales_order` ON `so.id = retur.sales_order_id`
- `so.outlet_id = session.OutletID`
- `retur.is_deleted = false`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "franchisor_id": "uuid",
      "code": "string",
      "sales_order_id": "uuid",
      "warehouse_id": "uuid",
      "warehouse_name": "string",
      "approved_by": "string",
      "document_status": "string",
      "notes": "string",
      "created_by": "string",
      "updated_by": "string",
      "created_at": "datetime",
      "updated_at": "datetime",
      "sales_order": { /* SalesOrder - optional */ },
      "items": null
    }
  ],
  "meta": { /* pagination */ }
}
```

---

### 6.2 POST /sales/return

**Auth:** Restricted

**Request Body:**
```json
{
  "sales_order_id": "uuid (required)",
  "notes": "string (optional)",
  "items": [
    {
      "sales_order_item_id": "uuid (required)",
      "quantity": 0.0 (required, > 0)
    }
  ]
}
```

**Validation:**
- `sales_order_id` must exist (via `FindByID`)
- `sales_order.outlet_id` must match `session.OutletID`
- `sales_order.fulfillment_status` must be `"completed"` → error `"cannot return items from an uncompleted or unfulfilled order"`
- Items:
  - No duplicate `sales_order_item_id`
  - Each `soi` must exist
  - `quantity` must be > 0
  - `quantity` must NOT exceed `soi.quantity_fulfilled`
  - Cumulative (already_returned + quantity) must NOT exceed `soi.quantity_fulfilled`

**Entity Construction:**
- `code`: Auto-generated `"RT-" + random(8, numeric)`
- `document_status`: `"pending"`
- Items reference `soi.ID`, `itemID`, `fractionID` from original SO item

**Response 201:** Created Retur object.

---

### 6.3 GET /sales/return/{id}

**Auth:** Restricted

**Path Params:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | uuid | Retur ID |

**Ownership Check:** `data.sales_order.outlet_id != session.OutletID` → `401 "unauthorized: return request does not belong to your outlet"`

**Response 200:** Single Retur with items[] and sales_order (with outlet).

---

### 6.4 DELETE /sales/return/{id}

**Auth:** Restricted

**Path Params:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | uuid | Retur ID |

**Validation:**
- Retur must exist

**Mutation:** `SoftDelete` (sets `is_deleted = true`)

**Response 200:**
```json
{
  "message": "Retur cancelled successfully",
  "success": true
}
```

---

## 7. Warehouse

### 7.1 GET /warehouse

**Auth:** Restricted

**Query Params:** None (no pagination fields in request struct)

**Business Logic:**
- Calls `services.NewWarehouseService().GetWarehouse(ctx, franchisorID)` via gRPC to `franq-warehouse` service

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "franchisor_id": "uuid",
      "code": "string",
      "name": "string",
      "address": "string",
      "city": "string",
      "province": "string",
      "is_active": true,
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```
*Note: Exact shape depends on `franq-warehouse/entity.Warehouse` definition.*

---

## State Machines

### SalesOrder State Machine

**Three orthogonal status dimensions:**

```
                  ┌─────────────────────────────┐
                  │      document_status        │
                  ├─────────────────────────────┤
  [Create] ───────▶ "published"                 │
     │                                          │
     ├─ [Saldo pay] ─────▶ "process"            │
     │                                           │
     ├─ [MarkPaid event] ──▶ "process"          │
     │                                           │
     ├─ [Cancel (if unpaid)] ──▶ "cancelled"    │
     │                                           │
     └─ [Fulfilled ext.] ───▶ "completed"       │
                  ┌─────────────────────────────┐
                  │      payment_status         │
                  ├─────────────────────────────┤
  [Create] ───────▶ "unpaid" (default)          │
     │              "paid" (if saldo)            │
     │                                           │
     ├─ [MarkPaid event] ──▶ "paid"             │
                  ┌─────────────────────────────┐
                  │    fulfillment_status        │
                  ├─────────────────────────────┤
  [Create] ───────▶ "new"                       │
     │                                           │
     └─ [Fulfilled ext.] ───▶ "completed"       │
                  └─────────────────────────────┘
```

**Cancel Guard Conditions:**
```
payment_status  == "unpaid"    AND
document_status != "cancelled"
```

**Paid Guard Conditions (via MarkPaid subscriber):**
```
(no guard visible in code — applies to any SO)
```

### Retur State Machine

```
                    ┌─────────────────────────┐
                    │    document_status      │
                    ├─────────────────────────┤
  [Create] ─────────▶ "pending"               │
     │                                         │
     ├─ [SoftDelete] ──▶ is_deleted = true    │
     │                    (logical delete)     │
     └─ [Approve ext.] ──▶ (external system)  │
                    └─────────────────────────┘
```

The `ValidAlreadyReturned` query excludes retur items where `document_status = 'cancelled'`, implying an approval/workflow system exists externally.

---

## Inter-Service Dependencies (gRPC)

| Service | Client | Methods Called |
|---------|--------|----------------|
| `franq-franchise` | `FranchiseReportServiceClient` | `GetOutletBalance`, `DebitOutletBalance`, `CreditOutletBalance` |
| `franq-payment-gateway` | `PaymentServiceClient` | `GetPaymentByOrderId` |
| `franq-warehouse` | `WarehouseServiceClient` | `GetWarehouses` |

---

## Events (RabbitMQ)

| Exchange/Routing Key | Payload | Trigger |
|----------------------|---------|---------|
| `franchise_order:sales.order.created` | `{sales_order: SalesOrder, published_at: timestamp}` | POST /sales/order (after persist) |

---

## Entity Relationship Diagram

```
User (users)
  ├── franchisor_id ──▶ Franchisor
  ├── usergroup_id  ──▶ UserGroup
  └── outlet_id     ──▶ Outlet
                          ├── franchisor_id ──▶ Franchisor
                          ├── outlet_type_id
                          └── region_id ──▶ Region (external)

SalesOrder
  ├── franchisor_id      ──▶ Franchisor
  ├── outlet_id          ──▶ Outlet
  ├── warehouse_id       ──▶ Warehouse (external)
  ├── payment_method_id  ──▶ PaymentMethod
  ├── recipient_region_id ──▶ Region (external)
  └── items ──▶ SalesOrderItem[]
                    ├── catalog_id  ──▶ Catalog
                    ├── item_id     ──▶ Item
                    ├── fraction_id ──▶ ItemFraction
                    └── parent_id  ──▶ SalesOrderItem (self-ref for bundles)

Catalog
  ├── item_id     ──▶ Item
  ├── fraction_id ──▶ ItemFraction
  └── bundles ──▶ CatalogBundle[]
                    ├── item_id     ──▶ Item
                    └── fraction_id ──▶ ItemFraction

Retur
  ├── franchisor_id   ──▶ Franchisor
  ├── sales_order_id  ──▶ SalesOrder
  ├── warehouse_id
  └── items ──▶ ReturItem[]
                  ├── order_item_id ──▶ SalesOrderItem
                  ├── item_id       ──▶ Item
                  └── fraction_id   ──▶ ItemFraction
```

---

## Open Questions

- What fulfillment workflow transitions `fulfillment_status` from `"new"` to `"completed"`?
- What system approves/rejects retur requests (transitions from `"pending"`)?
- What sets `document_status = "completed"` on SalesOrder?
- Is `shipping_charges` always 0 or set externally?
- What is the `RefCode` field used for (optional on create)?

---

## Next Steps

1. Review this API contract with stakeholders
2. Proceed to `/specify api-contract` if formal spec needed
3. Use this as reference for frontend integration

---

*Research completed with SDD 2.0*
