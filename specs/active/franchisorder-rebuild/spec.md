# Specification: Franchisorder v2

**Task ID:** franchisorder-rebuild
**Created:** 2026-05-11
**Status:** Ready for Planning
**Version:** 2.0

## 1. Problem Statement
- **The Problem:** The current `franchisorder` web client is built on a legacy stack that is difficult to maintain and doesn't align with the elite service-layer patterns used in newer projects like `franchisee-v2`.
- **Current Situation:** Logic is scattered across services and stores using an older action-creator pattern. Maintenance is slow, and type safety is missing.
- **Desired Outcome:** A modern, type-safe React SPA that mirrors the original application's features and API contracts exactly, while following the highly structured service-layer architecture from `franchisee-v2`.

## 2. User Personas
### Primary User: Store Manager
- **Who:** Operates the POS at the store level.
- **Goals:** Quickly process customer orders, view order history, and manage store settings.
- **Pain points:** Slow UI, disconnected order states, and login friction.

### Secondary User: Franchise Owner
- **Who:** Monitors multi-store performance.
- **Goals:** Access dashboards and manage user roles.

## 3. Functional Requirements

### 3.1 Authentication (Auth Domain)
| ID | Requirement | User Story | Acceptance Criteria |
|----|-------------|------------|----------------------|
| FR-AUTH-01 | Standard Login | As a user, I want to sign in with my username and password. | `POST /auth/signin` successful. Token stored in `auth` slice. |
| FR-AUTH-02 | Seamless Login | As a user, I want the app to automatically log me in via URL parameters. | On boot, if `username` exists in query string, dispatch `$signout` then `$seamless` with static dev token. |
| FR-AUTH-03 | Profile Management | As a user, I want to view and update my profile. | `GET /auth/me` on init. `PUT /auth/me` for updates. |

### 3.2 Catalog Domain
| ID | Requirement | User Story | Acceptance Criteria |
|----|-------------|------------|----------------------|
| FR-CAT-01 | Browse Catalog | As a user, I want to see a paginated list of products. | `GET /catalog` with `search`, `page`, `limit` (default 13), and `order_by`. |
| FR-CAT-02 | Product Detail | As a user, I want to see detailed info for a product. | `GET /catalog/:id` returns product data. |

### 3.3 Order Domain
| ID | Requirement | User Story | Acceptance Criteria |
|----|-------------|------------|----------------------|
| FR-ORD-01 | View History | As a user, I want to see a list of my orders with status filters. | `GET /order` with `status`, `page`, and `limit`. |
| FR-ORD-02 | Order Detail | As a user, I want to see the details of a specific order. | `GET /order/:id` returns items, status, and total. |
| FR-ORD-03 | Cancel Order | As a user, I want to cancel a pending order with a reason. | `PUT /order/:id/cancel` with `void_note`. |
| FR-ORD-04 | Payment Method | As a user, I want to see the payment method for an order. | `GET /order/:id/payment-method`. |

### 3.4 Cart & Checkout Domain
| ID | Requirement | User Story | Acceptance Criteria |
|----|-------------|------------|----------------------|
| FR-CHK-01 | Cart Management | As a user, I want to add/remove products and adjust quantities. | Local `orderSlice` manages state. Items formatted as `{ catalog_id, quantity }`. |
| FR-CHK-02 | Payment Methods | As a user, I want to choose from available payment methods. | `GET /cart/payment-method` fetches list. |
| FR-CHK-03 | Checkout | As a user, I want to finalize my order. | `POST /cart/checkout` with `items`, `payment_method`, and `shipping_at` (YYYY-MM-DD). |
| FR-CHK-04 | Delivery Schedule | As a user, I want to see the available delivery schedule for my cart. | `POST /cart/schedule` returns available slots. |

## 4. Non-Functional Requirements
- **Architecture:** Must follow `franchisee-v2` modular service structure.
- **Type Safety:** 100% TypeScript coverage for API interfaces and Redux state.
- **Performance:** App boot (including bootstrap logic) ≤ 2s on standard 4G.
- **Persistence:** Auth session and current cart must persist across reloads via Redux-Persist.
- **Security:** Bearer token injection in `baseQuery`. Automatic logout on 401/403.

## 5. Out of Scope
- ❌ Offline mode (requires server sync).
- ❌ Third-party payment gateway integration (handled by backend).
- ❌ Inventory management (separate project).

## 6. Edge Cases & Error Handling
| Scenario | Expected Behavior |
|----------|-------------------|
| Bootstrap Fail | If `GET /auth/me` fails on boot, clear session and show login screen. |
| Seamless Fail | If URL params are malformed, ignore seamless login and show normal flow. |
| Network Error | `baseQuery` must log the error and show a global toast notification. |
| Empty Checkout | Checkout button disabled if cart items count is zero. |
| API 401/403 | Intercept in `baseQuery`, clear `persist:root`, and redirect to `/signin`. |

## 7. Success Metrics
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Feature Parity | 100% | Manual audit against original franchisorder. |
| Code Quality | A-Grade | ESLint + SonarQube (if available). |
| Load Time | < 2s | Chrome DevTools Lighthouse audit. |

## 8. Open Questions
- [ ] Confirm if the static token `GMOH6YbLKhcOrBOW1iV4WZOIhnrC7dom` should be stored in `.env` or remain in the bootstrap logic.
- [ ] Are there any new API fields in the backend that weren't in the original project?

## 9. Revision History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-05-10 | Initial brief. |
| 2.0 | 2026-05-11 | Updated with full API map from research and pattern alignment with franchisee-v2. |

## Next Steps
1. Review this specification with stakeholders.
2. Run `/plan franchisorder-rebuild` to create the technical architecture based on the confirmed service patterns.

*Specification created with SDD 4.0*
