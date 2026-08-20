# Specification: Wallet Screen

**Task ID:** wallet-screen
**Created:** 2026-08-20
**Status:** Ready for Planning
**Version:** 1.0

## 1. Problem Statement
- The Problem: Outlet owners need visibility into their financial balance (saldo) and ability to manage funds (topup/withdrawal) directly within the app, rather than relying on manual processes.
- Current Situation: Saldo balance is visible on the profile screen but there is no mechanism to manage it (request topup/withdrawal) or view detailed transaction history.
- Desired Outcome: A dedicated Wallet screen that allows franchise outlets to check their current balance, request topups/withdrawals, and view detailed balance logs.

## 2. User Personas
### Primary User: Outlet Owner
- Who: Franchise outlet manager/owner.
- Goals: Maintain sufficient balance for operations, manage cash flow, audit financial activities.
- Pain points: Lack of transparency in saldo movements, manual topup/withdrawal requests outside the app.

## 3. Functional Requirements
### FR-1: View Saldo Balance
**Description:** Display the current available saldo for the outlet.

**User Story:**
> As an outlet owner, I want to see my current available saldo so that I know if I have enough balance to place orders.

**Acceptance Criteria:**
- [ ] Saldo displayed prominently at the top of the wallet screen.
- [ ] Saldo format should be currency formatted (e.g., Rp X.XXX.XXX).

**Priority:** Must Have

### FR-2: Request Topup
**Description:** Allow outlet owner to request a balance topup.

**User Story:**
> As an outlet owner, I want to request a balance topup so that I can increase my purchasing power.

**Acceptance Criteria:**
- [ ] Topup button opens a modal form.
- [ ] Form requires nominal amount (min Rp 10.000) and description.
- [ ] Successful submission shows success toast.

**Priority:** Must Have

### FR-3: Request Withdrawal
**Description:** Allow outlet owner to request a balance withdrawal.

**User Story:**
> As an outlet owner, I want to request a balance withdrawal so that I can access my earnings.

**Acceptance Criteria:**
- [ ] Withdrawal button opens a modal form.
- [ ] Form requires nominal amount (min Rp 10.000) and description.
- [ ] Successful submission shows success toast.

**Priority:** Must Have

### FR-4: View Transaction Logs
**Description:** Display a paginated history of saldo movements.

**User Story:**
> As an outlet owner, I want to view my transaction history so that I can audit my financial activities.

**Acceptance Criteria:**
- [ ] Paginated list of balance logs (topups/withdrawals).
- [ ] Each log shows description, timestamp, and amount (positive/negative).

**Priority:** Must Have

## 4. Non-Functional Requirements
- Performance: Wallet list should load within 2s under normal conditions.
- Security: All requests must be authenticated via outlet-scoped JWT.
- Accessibility: All interactive elements should have proper ARIA labels.

## 5. Out of Scope
- ❌ Admin-level approval/rejection workflows (handled in admin dashboard).
- ❌ Direct bank integration (requests are processed by admins).

## 6. Edge Cases & Error Handling
| Scenario | Expected Behavior |
|----------|-------------------|
| Balance is 0 | Show Rp 0 |
| Request < 10.000 | Show validation error |
| API Error | Show toast notification with error |

| Error | User Message | System Action |
|-------|--------------|---------------|
| Request Fail | "Failed to submit request" | Keep modal open |

## 7. Success Metrics
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Wallet Adoption | 90% of owners | Analytics event |
| Request Volume | Track volume | API metrics |

## 8. Open Questions
- [ ] Should we filter logs by date range in the initial release? (Proposed: No, just paginated list)

## 9. Revision History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-08-20 | Initial specification |

## Next Steps
1. Review spec with stakeholders
2. Resolve open questions
3. Run `/plan wallet-screen` to create technical plan

*Specification created with SDD 4.0*
