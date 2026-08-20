# API Contract — Franchise Financial (balance_log, outlet_topup_request, withdrawal_request)

> **Service:** `franchise-order` (Go microservice)
> **Generated:** 2026-08-20
> **Base Path:** `/franchise-order`

---

## Table of Contents

1. [Common Conventions](#1-common-conventions)
2. [State Machines](#2-state-machines)
3. [Domain: balance_log](#3-domain-balance_log)
4. [Domain: outlet_topup_request](#4-domain-outlet_topup_request)
5. [Domain: withdrawal_request](#5-domain-withdrawal_request)

---

## 1. Common Conventions

### 1.1 Standard Response Envelope

Every endpoint returns this shape:

```json
{
  "status": 200,
  "message": "success get balance log",
  "data": { ... },
  "error": [],
  "pagination": {
    "limit": 25,
    "offset": 0,
    "has_next": true,
    "total_pages": 4,
    "total_data": 100
  }
}
```

- `pagination` only present on list endpoints.
- `data` is a single object on detail endpoints, an array on list endpoints.

### 1.2 Auth Context (JWT)

Every request carries a validated JWT with:

| Claim | Type | Description |
|-------|------|-------------|
| `user_id` | `uint64` | Internal user ID |
| `role_id` | `uint64` | Role ID (see roles below) |
| `outlet_id` | `uint64` | Outlet ID (0 for HQ roles) |

### 1.3 Role Matrix

| Role ID | Name | Data Scope |
|---------|------|------------|
| 1 | `admin` (HQ) | All data across all outlets |
| 2 | `outlet_owner` | Own outlet only |
| 3 | `outlet_stuff` | Own outlet only |

- **Balance Log:** `admin` sees all; `outlet_owner`/`outlet_stuff` see own outlet logs.
- **Topup Request:** `outlet_owner` creates; `admin` approves/rejects; `outlet_stuff` can update own pending requests.
- **Withdrawal Request:** `outlet_owner` creates; `admin` approves/rejects and disburses; `outlet_stuff` can update own pending requests.

### 1.4 Query Parameters (List Endpoints)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | `string` | `""` | Fuzzy search on `id`, `outlet_id`, `money`, `type`, `description` |
| `filter` | `string` | `""` | Comma-separated: `outlet_id=3,type=1,description=mutasi` |
| `sort` | `string` | `""` | Comma-separated: `+money,-created_at` (+ asc, - desc) |
| `limit` | `int` | `25` | Page size |
| `offset` | `int` | `0` | Offset (page * limit) |
| `page` | `int` | `0` | Alternative to offset |
| `start_date` | `string` | `""` | Filter created_at >= date (for balance_log) |
| `end_date` | `string` | `""` | Filter created_at <= date (for balance_log) |

### 1.5 Sortable Fields

- **balance_log:** `id`, `outlet_id`, `money`, `type`, `description`, `created_at`
- **outlet_topup_request:** `id`, `outlet_id`, `status`, `money`, `approved_by`, `created_at`
- **withdrawal_request:** `id`, `outlet_id`, `status`, `money`, `approved_by`, `disbursed_by`, `created_at`

### 1.6 Date Format

All dates use: `YYYY-MM-DD HH:MM:SS`

---

## 2. State Machines

### 2.1 outlet_topup_request Status

```
┌─────────┐    outlet_owner     ┌─────────┐   admin approve   ┌──────────┐
│ created  │ ──────────────────► │ pending  │ ────────────────► │ approved │
│   (1)    │                    │   (2)    │                   │   (3)    │
└─────────┘                    └─────────┘                    └──────────┘
                                    │
                                    │  admin reject
                                    ▼
                               ┌──────────┐
                               │ rejected │
                               │   (4)    │
                               └──────────┘
```

**Transitions:**

| From | To | Trigger | Actor |
|------|----|---------|-------|
| `created (1)` | `pending (2)` | Submit request | `outlet_owner` |
| `pending (2)` | `approved (3)` | Approve | `admin` |
| `pending (2)` | `rejected (4)` | Reject | `admin` |
| `created (1)` | `pending (2)` | Update own request | `outlet_owner` / `outlet_stuff` |

**Side effects on approve:**
1. Insert `outlet_balance.mutated_balance` += `request.money`
2. Create `balance_log` record (type=1 topup)

**Side effects on reject:**
- None. Money not moved.

### 2.2 withdrawal_request Status

```
┌─────────┐   outlet_owner    ┌─────────┐  admin approve  ┌──────────┐  admin disburses  ┌────────────┐
│ created  │ ───────────────► │ pending  │ ──────────────► │ approved │ ───────────────► │ disbursed  │
│   (1)    │                  │   (2)    │                 │   (3)    │                  │    (4)     │
└─────────┘                  └─────────┘                  └──────────┘                  └────────────┘
                                  │
                                  │  admin reject
                                  ▼
                             ┌──────────┐
                             │ rejected │
                             │   (5)    │
                             └──────────┘
```

**Transitions:**

| From | To | Trigger | Actor |
|------|----|---------|-------|
| `created (1)` | `pending (2)` | Submit request | `outlet_owner` |
| `pending (2)` | `approved (3)` | Approve | `admin` |
| `pending (2)` | `rejected (5)` | Reject | `admin` |
| `approved (3)` | `disbursed (4)` | Disburse | `admin` |
| `created (1)` | `pending (2)` | Update own request | `outlet_owner` / `outlet_stuff` |

**Side effects on approve:**
1. Deduct `outlet_balance.mutated_balance` -= `request.money`
2. Create `balance_log` record (type=2 withdrawal)

**Side effects on disburse:**
- None additional. Money already deducted on approval.

**Side effects on reject:**
- None. Money not moved.

---

## 3. Domain: balance_log

### 3.1 Data Type

```typescript
interface BalanceLog {
  id:         uint64;        // auto-increment
  outlet_id:  uint64;        // FK → outlets
  money:      int64;         // signed: positive = credit, negative = debit (in smallest unit)
  type:       uint8;         // 1 = topup, 2 = withdrawal
  description: string;       // max 255 chars
  created_at: string;        // timestamp
  updated_at: string;        // timestamp
}
```

**Type Enum:**

| Value | Label |
|-------|-------|
| `1` | Topup |
| `2` | Withdrawal |

### 3.2 List Balance Logs

```
GET /balance-log
```

**Auth:** All roles

**Query Params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | No | Fuzzy search |
| `filter` | string | No | `outlet_id=X`, `type=X`, `description=X` |
| `sort` | string | No | `+created_at`, `-money`, etc. |
| `limit` | int | No | Default 25 |
| `offset` | int | No | Default 0 |
| `page` | int | No | Alternative to offset |
| `start_date` | string | No | `YYYY-MM-DD` |
| `end_date` | string | No | `YYYY-MM-DD` |

**Authorization Logic:**

```go
if user.role_id != 1 {
    filter += fmt.Sprintf(",outlet_id=%d", user.outlet_id)
}
```

**Response (200):**

```json
{
  "status": 200,
  "message": "success get balance log",
  "data": [
    {
      "id": 1,
      "outlet_id": 10,
      "money": 500000,
      "type": 1,
      "type_label": "topup",
      "description": "Topup request #15 approved",
      "created_at": "2026-08-20 10:30:00",
      "updated_at": "2026-08-20 10:30:00"
    },
    {
      "id": 2,
      "outlet_id": 10,
      "money": -200000,
      "type": 2,
      "type_label": "withdrawal",
      "description": "Withdrawal request #8 disbursed",
      "created_at": "2026-08-19 14:00:00",
      "updated_at": "2026-08-19 14:00:00"
    }
  ],
  "error": [],
  "pagination": {
    "limit": 25,
    "offset": 0,
    "has_next": false,
    "total_pages": 1,
    "total_data": 2
  }
}
```

### 3.3 Detail Balance Log

```
GET /balance-log/:balance_log_id
```

**Auth:** All roles (outlet roles scoped to own outlet)

**Response (200):**

```json
{
  "status": 200,
  "message": "success get balance log",
  "data": {
    "id": 1,
    "outlet_id": 10,
    "money": 500000,
    "type": 1,
    "type_label": "topup",
    "description": "Topup request #15 approved",
    "created_at": "2026-08-20 10:30:00",
    "updated_at": "2026-08-20 10:30:00"
  },
  "error": []
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `invalid balance log id` (param parse fail) |
| 404 | `balance log not found` |
| 403 | `forbidden: outlet scope` (outlet role accessing other outlet's log) |

---

## 4. Domain: outlet_topup_request

### 4.1 Data Type

```typescript
interface OutletTopupRequest {
  id:          uint64;         // auto-increment
  outlet_id:   uint64;         // FK → outlets
  status:      uint8;          // 1=created, 2=pending, 3=approved, 4=rejected
  money:       int64;          // amount requested (positive, in smallest unit)
  approved_by: uint64 | null;  // user_id of approver (null if not yet processed)
  description: string;         // max 255 chars
  created_at:  string;         // timestamp
  updated_at:  string;         // timestamp
}
```

**Status Enum:**

| Value | Label |
|-------|-------|
| `1` | Created |
| `2` | Pending |
| `3` | Approved |
| `4` | Rejected |

**Labels:**

```go
var TopupStatusLabel = map[uint8]string{
    1: "created",
    2: "pending",
    3: "approved",
    4: "rejected",
}
```

### 4.2 List Topup Requests

```
GET /topup-request
```

**Auth:** All roles

**Query Params:** Same as [§1.4](#14-query-parameters-list-endpoints)

**Authorization Logic:**

```go
if user.role_id != 1 {
    filter += fmt.Sprintf(",outlet_id=%d", user.outlet_id)
}
```

**Response (200):**

```json
{
  "status": 200,
  "message": "success get topup request",
  "data": [
    {
      "id": 15,
      "outlet_id": 10,
      "status": 2,
      "status_label": "pending",
      "money": 500000,
      "approved_by": null,
      "description": "Need topup for operations",
      "created_at": "2026-08-20 09:00:00",
      "updated_at": "2026-08-20 09:00:00"
    }
  ],
  "error": [],
  "pagination": {
    "limit": 25,
    "offset": 0,
    "has_next": false,
    "total_pages": 1,
    "total_data": 1
  }
}
```

### 4.3 Detail Topup Request

```
GET /topup-request/:topup_request_id
```

**Auth:** All roles (outlet roles scoped to own outlet)

**Response (200):**

```json
{
  "status": 200,
  "message": "success get topup request",
  "data": {
    "id": 15,
    "outlet_id": 10,
    "status": 2,
    "status_label": "pending",
    "money": 500000,
    "approved_by": null,
    "description": "Need topup for operations",
    "created_at": "2026-08-20 09:00:00",
    "updated_at": "2026-08-20 09:00:00"
  },
  "error": []
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `invalid topup request id` |
| 404 | `topup request not found` |
| 403 | `forbidden: outlet scope` |

### 4.4 Create Topup Request

```
POST /topup-request
```

**Auth:** `outlet_owner`, `outlet_stuff`

**Request Body:**

```json
{
  "outlet_id": 10,
  "money": 500000,
  "description": "Need topup for operations"
}
```

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `outlet_id` | Required. Must match user's outlet_id for outlet roles. |
| `money` | Required. Min: `10000`. |
| `description` | Required. Max length: 255 chars. |

**Response (201):**

```json
{
  "status": 201,
  "message": "success create topup request",
  "data": {
    "id": 15,
    "outlet_id": 10,
    "status": 1,
    "status_label": "created",
    "money": 500000,
    "approved_by": null,
    "description": "Need topup for operations",
    "created_at": "2026-08-20 09:00:00",
    "updated_at": "2026-08-20 09:00:00"
  },
  "error": []
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `bad request: [validation errors]` |
| 403 | `forbidden: outlet scope` |

### 4.5 Update Topup Request

```
PUT /topup-request/:topup_request_id
```

**Auth:** `outlet_owner`, `outlet_stuff` (own outlet, own request only)

**Request Body:**

```json
{
  "outlet_id": 10,
  "money": 750000,
  "description": "Updated amount for operations"
}
```

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `outlet_id` | Required. Must match request's outlet_id. |
| `money` | Required. Min: `10000`. |
| `description` | Required. Max length: 255 chars. |

**Response (200):**

```json
{
  "status": 200,
  "message": "success update topup request",
  "data": {
    "id": 15,
    "outlet_id": 10,
    "status": 1,
    "status_label": "created",
    "money": 750000,
    "approved_by": null,
    "description": "Updated amount for operations",
    "created_at": "2026-08-20 09:00:00",
    "updated_at": "2026-08-20 09:15:00"
  },
  "error": []
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `bad request: [validation errors]` |
| 400 | `invalid topup request id` |
| 404 | `topup request not found` |
| 403 | `forbidden: outlet scope` |

### 4.6 Delete Topup Request

```
DELETE /topup-request/:topup_request_id
```

**Auth:** `outlet_owner`, `outlet_stuff` (own outlet, own request only)

**Response (200):**

```json
{
  "status": 200,
  "message": "success delete topup request",
  "data": [],
  "error": []
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `invalid topup request id` |
| 404 | `topup request not found` |
| 403 | `forbidden: outlet scope` |

### 4.7 Change Status (Approve / Reject)

```
PUT /topup-request/:topup_request_id/status
```

**Auth:** `admin` only

**Request Body:**

```json
{
  "status": 3
}
```

**Status Values:**

| Value | Action |
|-------|--------|
| `3` | Approve — creates balance_log (type=1) |
| `4` | Reject — no side effects |

**Response (200):**

```json
{
  "status": 200,
  "message": "success update status topup request",
  "data": {
    "id": 15,
    "outlet_id": 10,
    "status": 3,
    "status_label": "approved",
    "money": 500000,
    "approved_by": 1,
    "description": "Need topup for operations",
    "created_at": "2026-08-20 09:00:00",
    "updated_at": "2026-08-20 11:00:00"
  },
  "error": []
}
```

**Side Effects (on approve):**

```
1. SELECT FROM outlet_balance WHERE outlet_id = {outlet_id}
2. UPDATE outlet_balance SET mutated_balance += {request.money}
3. INSERT INTO balance_log (outlet_id, money, type, description) VALUES ({outlet_id}, {request.money}, 1, 'topup request ... approved')
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `invalid topup request id` |
| 400 | `invalid request, status is required` |
| 404 | `topup request not found` |

---

## 5. Domain: withdrawal_request

### 5.1 Data Type

```typescript
interface WithdrawalRequest {
  id:           uint64;         // auto-increment
  outlet_id:    uint64;         // FK → outlets
  status:       uint8;          // 1=created, 2=pending, 3=approved, 4=disbursed, 5=rejected
  money:        int64;          // amount requested (positive, in smallest unit)
  approved_by:  uint64 | null;  // user_id who approved
  disbursed_by: uint64 | null;  // user_id who disbursed
  description:  string;         // max 255 chars
  created_at:   string;         // timestamp
  updated_at:   string;         // timestamp
}
```

**Status Enum:**

| Value | Label |
|-------|-------|
| `1` | Created |
| `2` | Pending |
| `3` | Approved |
| `4` | Disbursed |
| `5` | Rejected |

**Labels:**

```go
var WithdrawalStatusLabel = map[uint8]string{
    1: "created",
    2: "pending",
    3: "approved",
    4: "disbursed",
    5: "rejected",
}
```

### 5.2 List Withdrawal Requests

```
GET /withdrawal-request
```

**Auth:** All roles

**Query Params:** Same as [§1.4](#14-query-parameters-list-endpoints)

**Authorization Logic:**

```go
if user.role_id != 1 {
    filter += fmt.Sprintf(",outlet_id=%d", user.outlet_id)
}
```

**Response (200):**

```json
{
  "status": 200,
  "message": "success get withdrawal request",
  "data": [
    {
      "id": 8,
      "outlet_id": 10,
      "status": 3,
      "status_label": "approved",
      "money": 200000,
      "approved_by": 1,
      "disbursed_by": null,
      "description": "Withdrawal for petty cash",
      "created_at": "2026-08-18 08:00:00",
      "updated_at": "2026-08-19 14:00:00"
    }
  ],
  "error": [],
  "pagination": {
    "limit": 25,
    "offset": 0,
    "has_next": false,
    "total_pages": 1,
    "total_data": 1
  }
}
```

### 5.3 Detail Withdrawal Request

```
GET /withdrawal-request/:withdrawal_request_id
```

**Auth:** All roles (outlet roles scoped to own outlet)

**Response (200):**

```json
{
  "status": 200,
  "message": "success get withdrawal request",
  "data": {
    "id": 8,
    "outlet_id": 10,
    "status": 3,
    "status_label": "approved",
    "money": 200000,
    "approved_by": 1,
    "disbursed_by": null,
    "description": "Withdrawal for petty cash",
    "created_at": "2026-08-18 08:00:00",
    "updated_at": "2026-08-19 14:00:00"
  },
  "error": []
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `invalid withdrawal request id` |
| 404 | `withdrawal request not found` |
| 403 | `forbidden: outlet scope` |

### 5.4 Create Withdrawal Request

```
POST /withdrawal-request
```

**Auth:** `outlet_owner`, `outlet_stuff`

**Request Body:**

```json
{
  "outlet_id": 10,
  "money": 200000,
  "description": "Withdrawal for petty cash"
}
```

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `outlet_id` | Required. Must match user's outlet_id for outlet roles. |
| `money` | Required. Min: `10000`. |
| `description` | Required. Max length: 255 chars. |

**Response (201):**

```json
{
  "status": 201,
  "message": "success create withdrawal request",
  "data": {
    "id": 8,
    "outlet_id": 10,
    "status": 1,
    "status_label": "created",
    "money": 200000,
    "approved_by": null,
    "disbursed_by": null,
    "description": "Withdrawal for petty cash",
    "created_at": "2026-08-20 09:00:00",
    "updated_at": "2026-08-20 09:00:00"
  },
  "error": []
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `bad request: [validation errors]` |
| 403 | `forbidden: outlet scope` |

### 5.5 Update Withdrawal Request

```
PUT /withdrawal-request/:withdrawal_request_id
```

**Auth:** `outlet_owner`, `outlet_stuff` (own outlet, own request only)

**Request Body:**

```json
{
  "outlet_id": 10,
  "money": 250000,
  "description": "Updated amount for petty cash"
}
```

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `outlet_id` | Required. Must match request's outlet_id. |
| `money` | Required. Min: `10000`. |
| `description` | Required. Max length: 255 chars. |

**Response (200):**

```json
{
  "status": 200,
  "message": "success update withdrawal request",
  "data": {
    "id": 8,
    "outlet_id": 10,
    "status": 1,
    "status_label": "created",
    "money": 250000,
    "approved_by": null,
    "disbursed_by": null,
    "description": "Updated amount for petty cash",
    "created_at": "2026-08-20 09:00:00",
    "updated_at": "2026-08-20 09:15:00"
  },
  "error": []
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `bad request: [validation errors]` |
| 400 | `invalid withdrawal request id` |
| 404 | `withdrawal request not found` |
| 403 | `forbidden: outlet scope` |

### 5.6 Delete Withdrawal Request

```
DELETE /withdrawal-request/:withdrawal_request_id
```

**Auth:** `outlet_owner`, `outlet_stuff` (own outlet, own request only)

**Response (200):**

```json
{
  "status": 200,
  "message": "success delete withdrawal request",
  "data": [],
  "error": []
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `invalid withdrawal request id` |
| 404 | `withdrawal request not found` |
| 403 | `forbidden: outlet scope` |

### 5.7 Change Status (Approve / Disburse / Reject)

```
PUT /withdrawal-request/:withdrawal_request_id/status
```

**Auth:** `admin` only

**Request Body:**

```json
{
  "status": 3
}
```

**Status Values:**

| Value | Action | Side Effects |
|-------|--------|-------------|
| `3` | Approve | Deduct `outlet_balance.mutated_balance` -= money; create `balance_log` (type=2) |
| `4` | Disburse | Mark disbursed_by; no additional balance movement |
| `5` | Reject | No side effects |

**Response (200):**

```json
{
  "status": 200,
  "message": "success update status withdrawal request",
  "data": {
    "id": 8,
    "outlet_id": 10,
    "status": 3,
    "status_label": "approved",
    "money": 200000,
    "approved_by": 1,
    "disbursed_by": null,
    "description": "Withdrawal for petty cash",
    "created_at": "2026-08-18 08:00:00",
    "updated_at": "2026-08-20 11:00:00"
  },
  "error": []
}
```

**Side Effects (on approve):**

```
1. SELECT FROM outlet_balance WHERE outlet_id = {outlet_id}
2. UPDATE outlet_balance SET mutated_balance -= {request.money}
3. INSERT INTO balance_log (outlet_id, money, type, description) VALUES ({outlet_id}, -{request.money}, 2, 'withdrawal request ... approved')
```

**Side Effects (on disburse):**

```
1. UPDATE withdrawal_request SET disbursed_by = {user_id} WHERE id = {id}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `invalid withdrawal request id` |
| 400 | `invalid request, status is required` |
| 404 | `withdrawal request not found` |

---

## Appendix A: Database Schema (PostgreSQL)

### balance_log

```sql
CREATE TABLE balance_log (
    id          BIGSERIAL PRIMARY KEY,
    outlet_id   BIGINT NOT NULL,
    money       BIGINT NOT NULL,
    type        SMALLINT NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_balance_log_outlet_id ON balance_log(outlet_id);
CREATE INDEX idx_balance_log_type ON balance_log(type);
```

### outlet_topup_request

```sql
CREATE TABLE outlet_topup_request (
    id          BIGSERIAL PRIMARY KEY,
    outlet_id   BIGINT NOT NULL,
    status      SMALLINT NOT NULL DEFAULT 1,
    money       BIGINT NOT NULL,
    approved_by BIGINT,
    description VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_topup_request_outlet_id ON outlet_topup_request(outlet_id);
CREATE INDEX idx_topup_request_status ON outlet_topup_request(status);
```

### withdrawal_request

```sql
CREATE TABLE withdrawal_request (
    id           BIGSERIAL PRIMARY KEY,
    outlet_id    BIGINT NOT NULL,
    status       SMALLINT NOT NULL DEFAULT 1,
    money        BIGINT NOT NULL,
    approved_by  BIGINT,
    disbursed_by BIGINT,
    description  VARCHAR(255) NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_withdrawal_request_outlet_id ON withdrawal_request(outlet_id);
CREATE INDEX idx_withdrawal_request_status ON withdrawal_request(status);
```

---

## Appendix B: Summary Endpoint Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/balance-log` | All | List balance logs |
| `GET` | `/balance-log/:balance_log_id` | All | Detail balance log |
| `GET` | `/topup-request` | All | List topup requests |
| `GET` | `/topup-request/:topup_request_id` | All | Detail topup request |
| `POST` | `/topup-request` | outlet_owner, outlet_stuff | Create topup request |
| `PUT` | `/topup-request/:topup_request_id` | outlet_owner, outlet_stuff | Update topup request |
| `DELETE` | `/topup-request/:topup_request_id` | outlet_owner, outlet_stuff | Delete topup request |
| `PUT` | `/topup-request/:topup_request_id/status` | admin | Approve / reject topup |
| `GET` | `/withdrawal-request` | All | List withdrawal requests |
| `GET` | `/withdrawal-request/:withdrawal_request_id` | All | Detail withdrawal request |
| `POST` | `/withdrawal-request` | outlet_owner, outlet_stuff | Create withdrawal request |
| `PUT` | `/withdrawal-request/:withdrawal_request_id` | outlet_owner, outlet_stuff | Update withdrawal request |
| `DELETE` | `/withdrawal-request/:withdrawal_request_id` | outlet_owner, outlet_stuff | Delete withdrawal request |
| `PUT` | `/withdrawal-request/:withdrawal_request_id/status` | admin | Approve / disburse / reject withdrawal |

**Total: 14 endpoints**

---

## Appendix C: Money Type Convention

- All monetary values stored as `BIGINT` (smallest unit, e.g. cents or rupiah sen).
- `balance_log.money` is **signed**: positive = credit (topup), negative = debit (withdrawal).
- `outlet_topup_request.money` and `withdrawal_request.money` are **unsigned** (always positive).
- `outlet_balance.mutated_balance` tracks current balance as signed `BIGINT`.
- Conversion to display: `display = money / 100` (if storing cents) or raw (if storing full rupiah).
