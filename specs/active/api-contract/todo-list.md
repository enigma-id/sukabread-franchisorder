# Todo List: API Contract Alignment

**Task ID:** api-contract
**Created:** 2026-07-10
**Updated:** 2026-07-10

## Progress Log

| Date | Progress |
|------|----------|
| 2026-07-10 | Started Phase 1 |

## Phase 1: Critical Fixes

- [x] **1.1** Define `Order` TypeScript interface in `types/api.ts`
- [x] **1.2** Fix order API paths and payloads in `order/api.tsx`
- [x] **1.3** Update order hooks in `order/hooks.tsx`

## Phase 2: Screen Data Alignment

- [x] **2.1** Create status normalizer utility `src/utils/order-status.ts`
- [x] **2.2** Fix OrderListScreen field names and meta shape
- [x] **2.3** Fix OrderDetailScreen field names and payment method

## Phase 3: Missing Capabilities

- [x] **3.1** Create profile API integration (profile/api.tsx + hooks)
- [x] **3.2** Update ProfileScreen to consume profile API
- [x] **3.3** Create retur API service (retur/api.tsx + hooks)

## Phase 4: Cleanup & Polish

- [x] **4.1** Remove `as any` casts in order screens
- [x] **4.2** TypeScript compilation passes
