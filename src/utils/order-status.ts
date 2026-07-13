export type OrderTabStatus = '' | 'pending' | 'completed' | 'canceled';
export type OrderDisplayStatus = 'pending' | 'active' | 'process' | 'completed' | 'finished' | 'canceled' | 'void';

/**
 * Map backend document_status + payment_status → frontend display value.
 * Pure function, no side effects.
 */
export function normalizeOrderStatus(
  document_status: string,
  payment_status?: string,
): OrderDisplayStatus {
  if (document_status === 'cancelled') return 'canceled';
  if (document_status === 'completed') return 'completed';
  if (document_status === 'published' && payment_status === 'paid') return 'active';
  if (document_status === 'published' && payment_status === 'unpaid') return 'pending';
  // Fallthrough: return raw value for unknown combinations
  return document_status as OrderDisplayStatus;
}

/**
 * Map frontend tab status → backend document_status filter value.
 */
export function mapStatusToBackend(tabStatus: string): string | undefined {
  if (!tabStatus) return undefined;
  // 'canceled' tab → backend expects 'cancelled'
  if (tabStatus === 'canceled') return 'cancelled';
  return tabStatus;
}
