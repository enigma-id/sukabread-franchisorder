# Technical Plan: Franchisorder Rebuild

**Task ID:** franchisorder-rebuild
**Status:** Ready for Implementation
**Based on:** spec.md v2.0
**Created:** 2026-05-11

## 1. System Architecture
- **Pattern:** Modular Service-Oriented SPA.
- **Structure:** Mirror `franchisee-v2/src/services/` for consistency.
- **Logic Isolation:** Business logic and API calls reside in `src/services/`, UI resides in `src/screens/` and `src/components/`.

### Architecture Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | Redux Toolkit | Centralized source of truth with RTK Query for efficient caching. |
| Persistence | Redux-Persist | Maintains session and cart state across page reloads. |
| API Layer | RTK Query | Built-in loading/error states and automated caching. |
| Routing | React Router v6 | Declarative routing with outlet-based layout management. |
| Error Handling | baseQuery Interceptor | Global handling of 401/403 to trigger automatic logout. |

## 2. Technology Stack
- **Frontend:** React 18, TypeScript 5.
- **Styling:** Tailwind CSS 4, daisyUI (Theme: `sukabread`).
- **State:** @reduxjs/toolkit, react-redux, redux-persist.
- **API:** RTK Query.
- **Routing:** react-router-dom.
- **Utilities:** lucide-react (icons), file-saver (receipts), logger (custom).

## 3. Component Design

### Folder Structure (Elite Service Pattern)
```
src/
├── components/         # Shared UI components (Button, Modal, Card)
│   └── ui/             # Atomic components
├── screens/            # Full-page screens (Catalog, Login, etc.)
├── services/           # CORE LOGIC
│   ├── auth/           # api.tsx, slice.tsx, hooks.tsx
│   ├── catalog/        # api.tsx
│   ├── order/          # api.tsx
│   ├── cart/           # api.tsx, slice.tsx (Cart management)
│   ├── baseQuery.tsx   # Global fetch wrapper
│   ├── reducer.tsx     # Combined root reducer
│   ├── store.tsx       # Store configuration
│   └── bootstrap.ts    # App initialization logic
└── utils/              # logger.ts, errors.ts
```

### Key Components
- **MainLayout:** Wraps protected routes, providing the `BottomMenu`.
- **AuthorizedRoute:** Guards access; redirects to `/signin` if not authenticated.
- **UnauthorizedRoute:** Redirects to `/` if already authenticated.
- **Bootstrap:** Executes before render to handle URL-param seamless login.

## 4. Data Model

### Core Interfaces
```ts
interface User {
  id: string;
  username: string;
  name: string;
  role: 'owner' | 'manager' | 'admin';
}

interface CatalogItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

interface CartItem {
  catalog_id: string;
  quantity: number;
}

interface Order {
  id: string;
  items: any[];
  total: number;
  status: 'pending' | 'completed' | 'canceled';
  payment_method?: string;
  created_at: string;
}
```

## 5. API Contracts (RTK Query Slices)

### Auth API (`/auth`)
- `signin`: `POST /auth/signin` -> `{ token, user }`
- `seamless`: `POST /auth/seamless` -> `{ token, user }`
- `getMe`: `GET /auth/me` -> `User`
- `updateMe`: `PUT /auth/me`

### Catalog API (`/catalog`)
- `getCatalog`: `GET /catalog?search=&page=&limit=13&order_by=catalog_id__name`
- `showCatalog`: `GET /catalog/:id`

### Order API (`/order`)
- `getOrders`: `GET /order?status=&page=&limit=10&order_by=-id`
- `showOrder`: `GET /order/:id`
- `cancelOrder`: `PUT /order/:id/cancel` -> `{ void_note }`
- `getOrderPaymentMethod`: `GET /order/:id/payment-method`

### Cart API (`/cart`)
- `checkout`: `POST /cart/checkout` -> `{ items, payment_method, shipping_at }`
- `getPaymentMethods`: `GET /cart/payment-method`
- `getSchedule`: `POST /cart/schedule` -> `{ items }`

## 6. Security Considerations
- **Token Storage:** Redux-Persist whitelisted `auth` slice.
- **Request Security:** Bearer token automatically added in `baseQuery.tsx`.
- **Session Expiry:** Automatic signout on 401 response in `baseQuery`.
- **Sanitization:** All inputs sanitized; no dangerouslySetInnerHTML without validation.

## 7. Performance Strategy
- **Caching:** RTK Query default cache (5m) for Catalog and Orders.
- **Bundling:** Vite code-splitting per route.
- **Rendering:** Optimized re-renders via specialized RTK Query hooks.

## 8. Implementation Phases

### Phase 1: Core Service Infrastructure
- [ ] Implement `utils/logger.ts` and `utils/errors.ts`.
- [ ] Implement `services/baseQuery.tsx` (mirror `franchisee-v2`).
- [ ] Implement `services/reducer.tsx` (mirror `franchisee-v2` signout logic).
- [ ] Implement `services/store.tsx`.

### Phase 2: Auth Domain
- [ ] Create `services/auth/api.tsx` and `services/auth/slice.tsx`.
- [ ] Update `services/bootstrap.ts` with correct URL parsing and `$seamless` logic.

### Phase 3: Domain APIs
- [ ] Create `services/catalog/api.tsx`.
- [ ] Create `services/order/api.tsx`.
- [ ] Create `services/cart/api.tsx` and `services/cart/slice.tsx` (cart logic).

### Phase 4: Screen Refactoring
- [ ] Refactor existing screens to use the new modular APIs and hooks.
- [ ] Implement missing logic (Schedule, Payment Methods, Order Cancelation).

## 9. Risk Assessment
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| API Field Mismatch | UI Crashes | Medium | Use strict TS interfaces; add optional chaining everywhere. |
| Bootstrap Failures | App Loop | Low | Add timeout and fallback to signin for bootstrap logic. |
| Receipt Printing | User Pain | Medium | Ensure `responseHandler` in `baseQuery` correctly processes PDF blobs. |

## 10. Open Questions
- [ ] Is there a specific logging service (like Sentry) used in `franchisee-v2` that should be added?
- [ ] Confirm the exact static token for `seamless` login in production.

## Next Steps
- Run `/tasks franchisorder-rebuild` to generate the updated task list.
- Proceed with implementation starting from the Service Infrastructure.

*Technical plan created with SDD 4.0*
