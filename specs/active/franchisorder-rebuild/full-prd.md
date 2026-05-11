# Product Requirements Document (PRD)
## Project: franchisorder‑v2
**Location:** `D:\Enigma\franchisorder‑v2`
**Date:** 2026‑05‑10

### 1. Problem Statement
The business operates a franchise‑order web portal (originally located at `D:\Enigma\suka‑bread\clients\web\franchisorder`). Stakeholders need a **modern, maintainable front‑end** built with the latest React stack while preserving **exactly the same user‑flow, UI design, and API contracts** that the legacy portal already provides.

### 2. Goal
Deliver a new React Vite application (`franchisorder‑v2`) that:

* **Re‑creates the full UI/UX** of the original `franchisorder` (login, catalog, order list, order detail, checkout, etc.).
* **Uses the same API endpoints** (`/auth/signin`, `/auth/me`, `/orders/*`, `/catalog/*`, …) that the original client already consumes.
* **Adopts the service‑layer architecture** you built for `franchisee‑v2` (Redux Toolkit store, RTK Query API slices, Redux‑Persist configuration, middleware pattern).
* Is **ready for incremental component work** – you will add the UI components later; the project skeleton, state management, routing, and API handling are fully in place.

### 3. Target Users / Personas
| Persona | Role | Primary Objectives |
|---------|------|--------------------|
| **Franchise Owner** | Business owner of a multi‑store franchise | View consolidated sales, cash flow, settlements; manage users. |
| **Store Manager** | Operator of a single franchise outlet | Process orders, view daily cash, generate receipts, run reports. |
| **Admin** | Platform administrator | Onboard new owners, control permissions, audit activity. |

### 4. Core Functional Requirements (must‑have)
| # | Feature | Description | Source (original) |
|---|---------|-------------|-------------------|
| 1 | **Authentication** | Login (`POST /auth/signin`), logout (sign‑out action), profile fetch (`GET /auth/me`), profile update (`PUT /auth/me`). | `src/screen/auth.login.js`, `src/services/auth/state.js` |
| 2 | **Protected Routing** | `AuthorizedRoute` renders main app after auth, `UnauthorizedRoute` renders login only. | `router.authorized.js`, `router.unauthorized.js` |
| 3 | **Catalog Screen** | Shows product catalog, allows selection → order creation. | `src/screen/catalog.js` |
| 4 | **Order List** | Displays list of current orders, pagination, filters. | `src/screen/order.js` |
| 5 | **Order Detail** | Shows details for a specific order (`/order/:id`). | `src/screen/order.detail.js` |
| 6 | **Checkout** | Finalizes an order, submits to back‑end, shows receipt. | `src/screen/checkout.js` |
| 7 | **Menu Bar** | Bottom navigation bar consistent across authorized screens. | `src/comps/layout.menu.js` |
| 8 | **State Persistence** | Redux‑Persist stores auth token, user, outlet, franchise, but excludes API slices. | `src/services/store.tsx` (from `franchisee‑v2` pattern) |
| 9 | **API Layer** | All API calls are wrapped with RTK Query `createApi` + custom `baseQuery` (axios). | `franchisee‑v2/src/services/*` – reused verbatim. |
|10 | **Activity / Loading Indicators** | Global activity tracking (e.g., `Activity.processing`, `Activity.done`) to drive UI spinners. | `src/services/activity.js` (original) |

### 5. Out‑of‑Scope (v1)
* New UI components not present in the original `franchisorder` (e.g., brand new dashboards).
* Mobile‑only native apps (React Native).
* Internationalisation (i18n) – placeholder only.
* Server‑side rendering – the app remains a static SPA.

### 6. Technical Stack (identical to `franchisee‑v2`)
| Layer | Technology |
|-------|------------|
| **Build** | Vite (React template) |
| **UI** | React 18, TypeScript, Tailwind CSS, DaisyUI |
| **State** | Redux Toolkit, RTK Query, Redux‑Persist |
| **Routing** | `react-router-dom` v6 (`BrowserRouter`, `Switch`, `Route`, redirects) |
| **HTTP** | Axios wrapper (`baseQuery.tsx`) with Bearer token injection |
| **Testing** | Vitest + React Testing Library (existing test config) |
| **Lint/Format** | ESLint + Prettier (shared config from `franchisee‑v2`) |
| **Version Control** | Git (project lives under `D:\Enigma\franchisorder‑v2`) |

### 7. Service / Folder Structure (mirrors `franchisee‑v2`)
```
franchisorder‑v2/
├─ src/
│  ├─ assets/                # images, icons
│  ├─ components/
│  │   ├─ ui/                # DaisyUI‑based reusable UI components
│  │   ├─ layout/            # MenuBar, Header, Footer
│  │   └─ app/               # Catalog, Order, Checkout pages (shell only)
│  ├─ services/
│  │   ├─ store.tsx          # configureStore + redux‑persist (copy from franchisee‑v2)
│  │   ├─ reducer.tsx        # combineReducers + API slice registration
│  │   ├─ baseQuery.tsx      # axios config (base URL, auth header, error handling)
│  │   ├─ auth/
│  │   │   ├─ api.tsx        # RTK Query endpoints: login, getMe, updateMe
│  │   │   ├─ slice.tsx      # auth reducer, signout action
│  │   │   └─ hooks.tsx      # generated hooks (`useLoginMutation`, …)
│  │   └─ … (other domains)  # keep empty for now – you will fill as needed
│  ├─ hooks/                 # custom hooks (e.g., useRedux, useDocumentMeta)
│  ├─ utils/                 # url builder, logger, permission helpers
│  ├─ router.authorized.js
│  ├─ router.unauthorized.js
│  ├─ index.css
│  └─ main.tsx
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
└─ README.md
```

### 8. API Contracts (copied from original `franchisorder`)
| Resource | Method | Path | Request Body | Response |
|----------|--------|------|--------------|----------|
| **Auth – Login** | POST | `/auth/signin` | `{ username, password }` | `{ token, refreshToken, user, outlet, franchise }` |
| **Auth – Get Me** | GET | `/auth/me` | – (optional query) | `{ id, name, role, … }` |
| **Auth – Update Me** | PUT | `/auth/me` | `{ name?, password?, confirm_password? }` | Updated user object |
| **Catalog** | GET | `/catalog` | – | List of products / items |
| **Order List** | GET | `/orders` | pagination / filter params | Paginated order list |
| **Order Detail** | GET | `/orders/:id` | – | Full order payload |
| **Checkout** | POST | `/checkout` | order payload | Receipt / confirmation |
| **Logout** | *Handled client‑side* – clears persisted Redux state and localStorage token. |

*All endpoints require `Authorization: Bearer <token>` header.*

### 9. Non‑Functional Requirements
| Category | Requirement |
|----------|-------------|
| **Performance** | Initial bundle ≤ 2 s on a 3G connection; subsequent API calls ≤ 300 ms. |
| **Security** | All traffic over HTTPS; JWT stored only in Redux‑Persist (no cookies). CSRF mitigated by SameSite policy. |
| **Accessibility** | WCAG 2.1 AA – focus management, ARIA labels on all interactive components. |
| **Scalability** | Redux‑Persist blacklists API slices to avoid blowing localStorage. |
| **Reliability** | Offline fallback: UI shows “offline” banner if fetch fails; persisted auth state survives page reloads. |
| **Testing** | ≥ 80 % unit‑test coverage on reducers, RTK Query endpoints, and critical UI components. |
| **CI/CD** | `npm run build` must pass lint, type‑check, and test steps before artifact publishing. |
| **Browser Support** | Chrome 108+, Edge 108+, Firefox 107+, Safari 15+. |

### 10. Success Metrics
| Metric | Target |
|--------|--------|
| **Feature Parity** | All screens/routes from original `franchisorder` exist and behave identically in `franchisorder‑v2`. |
| **Zero API Errors** | After integration, **no** 4xx/5xx responses when exercising the full flow against the existing back‑end. |
| **Build Health** | `npm run build` completes without TypeScript errors and produces a `dist/` folder. |
| **Stakeholder Sign‑off** | Product owner, UI designer, and backend team approve the PRD and the generated folder skeleton. |
| **Test Coverage** | `npm run test -- --coverage` reports ≥ 80 % coverage. |

### 11. Open Questions (to be resolved before implementation)
1. **Base URL** – What is the exact API base URL for the new front‑end (e.g., `https://api.myfranchise.id/v1`)?
2. **Environment Variables** – Any additional ENV vars (feature flags, analytics keys) that differ from `franchisee‑v2`?
3. **Branding Assets** – Will the logo, colour scheme, or text differ from the original, or can we reuse the existing assets?
4. **Deployment Target** – Preferred static host (Vercel, Netlify, internal CDN) and any required CI pipeline hooks?

### 12. Revision History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026‑05‑10 | Initial PRD – derived from original `franchisorder` flow and `franchisee‑v2` service pattern. |
| 1.1 | – | Pending updates after answers to open questions. |
```

---

## 📄 `spec.md`
````markdown
# Specification: franchisorder‑v2

**Task ID:** franchisorder‑v2
**Created:** 2026‑05‑10
**Status:** Ready for Implementation

## 1. Problem Statement
Re‑implement the existing `clients/web/franchisorder` application using a modern React stack while preserving every UI screen, navigation step, and API contract. The new codebase must follow the clean service‑layer pattern you already built for `franchisee‑v2`.

## 2. User Personas
- **Franchise Owner** – needs overview dashboards and user management.
- **Store Manager** – processes orders, checks daily cash, runs checkout.
- **Admin** – creates users, configures outlets, monitors activity.

## 3. Functional Requirements
### 3.1 Authentication
| ID | Requirement | User Story | Acceptance Criteria |
|----|-------------|------------|----------------------|
| FR‑AUTH‑01 | Login | As a user, I want to enter my phone number and PIN to access the system. | UI shows username & password fields.<br>POST `/auth/signin` → token stored in Redux‑Persist.<br>Redirect to catalog page. |
| FR‑AUTH‑02 | Auto‑login (persisted state) | As a returning user, I want to stay logged in across page reloads. | On app start, persisted state is rehydrated; if token exists, protected routes open automatically. |
| FR‑AUTH‑03 | Logout | As a user, I can log out and clear my session. | Clicking logout dispatches `$signout`.<br>Redux state resets to initial (no token).<br>LocalStorage `persist:root` is removed. |
| FR‑AUTH‑04 | Profile fetch | As a logged‑in user, I can view my profile data. | After login, GET `/auth/me` executes.<br>Data populates the profile screen. |
| FR‑AUTH‑05 | Profile update | As a user, I can change my name or password. | PUT `/auth/me` with changed fields.<br>Success updates Redux state and shows confirmation. |

### 3.2 Navigation & Routing
| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| FR‑NAV‑01 | Public route `/signin` | Unauthenticated users are redirected to `/signin`. |
| FR‑NAV‑02 | Protected routes (`/`, `/order`, `/order/:id`, `/checkout`) | Authenticated users can access; otherwise redirected to `/signin`. |
| FR‑NAV‑03 | Bottom menu bar | Visible on all protected screens, provides navigation to Catalog, Orders, Checkout. |

### 3.3 Core Screens
| ID | Screen | Description | Acceptance Criteria |
|----|--------|-------------|----------------------|
| FR‑SCR‑01 | Catalog | Lists products available for ordering. | Data fetched from `/catalog` endpoint.<br>Items displayed in a grid.<br>Clicking an item adds it to the current order. |
| FR‑SCR‑02 | Order List | Shows a list of pending orders. | GET `/orders` with pagination.<br>Each row shows order ID, status, total.<br>Clicking a row navigates to Order Detail (`/order/:id`). |
| FR‑SCR‑03 | Order Detail | Displays details of a single order, allows editing. | GET `/orders/:id`.<br>UI shows line items, quantities, total.<br>Can change quantity, remove items, then save (PUT). |
| FR‑SCR‑04 | Checkout | Finalises the order and prints receipt. | POST `/checkout` with order payload.<br>On success, shows receipt modal and clears order state. |
| FR‑SCR‑05 | Login (Auth) | Simple login form (username & PIN). | Matches UI from original `auth.login.js`.<br>Shows validation errors returned by API. |

### 3.4 State Management (service pattern)
- **Store configuration** identical to `franchisee‑v2/src/services/store.tsx`.
- **Root reducer** combines auth slice, UI slice (if any), and all RTK Query API reducers (`authApi`, `userApi`, `salesApi`, `reportApi`, `tableApi`).
- **Persist config** blacklists API slices, persists only `auth`, `user`, `outlet`, `franchise`, `token`.

### 3.5 API Layer
All API calls are implemented via **RTK Query** using the `baseQuery` pattern from `franchisee‑v2`:
```ts
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: User }, Credentials>(...),
    getMe: builder.query<User, void>(...),
    updateMe: builder.mutation<User, Partial<User>>(...)
  })
});
export const { useLoginMutation, useLazyGetMeQuery, useUpdateMeMutation } = authApi;
```
Other domain APIs (`userApi`, `salesApi`, `reportApi`, `tableApi`) will be added later following the same pattern.

### 3.6 Non‑Functional Requirements
| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| NFR‑01 | Performance | First paint ≤ 2 s on 3G; subsequent API calls ≤ 300 ms (measured with Chrome devtools). |
| NFR‑02 | Security | All requests over HTTPS; JWT stored only in Redux‑Persist; token sent via `Authorization: Bearer`. |
| NFR‑03 | Accessibility | All interactive elements keyboard‑focusable; ARIA labels present; colour contrast ≥ 4.5:1. |
| NFR‑04 | Test Coverage | `npm test` reports ≥ 80 % coverage across reducers, RTK Query endpoints, and critical UI components. |
| NFR‑05 | CI Pipeline | Lint, type‑check, and test steps must pass before `npm run build` is allowed. |
| NFR‑06 | Browser Support | Chrome 108+, Edge 108+, Firefox 107+, Safari 15+. |

### 4. Open Questions (re‑iterated)
1. Exact **API base URL** for the new front‑end.
2. Any additional **ENV vars** (feature flags, analytics keys) that differ from `franchisee‑v2`?
3. **Branding assets** – reuse existing logo, colour scheme, or provide new files?
4. Preferred **deployment target** (Vercel, Netlify, internal CDN) and any required CI hooks?

### 5. Acceptance Checklist
- [ ] Project skeleton (`src/`, `services/`, `components/`) matches the layout above.
- [ ] Redux store, reducer, and persist configuration compile without TypeScript errors.
- [ ] All routes (`AuthorizedRoute`, `UnauthorizedRoute`) function as described.
- [ ] Auth flow works end‑to‑end against the live back‑end.
- [ ] UI screens (Catalog, Order List, Order Detail, Checkout) render data from API without modification.
- [ ] Lint, type‑check, and test suite all pass.

### 6. Revision History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026‑05‑10 | Initial specification derived from original `franchisorder` flow and `franchisee‑v2` service pattern. |
| 1.1 | – | Pending updates after answers to open questions. |
````
