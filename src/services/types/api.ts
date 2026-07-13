/**
 * Core API type definitions for the WMS client application
 */

/**
 * Base API error structure
 */
export interface ApiError {
  status?: number;
  data?: {
    message?: string;
    errors?: {
      id?: string;
      [key: string]: string | string[] | unknown;
    };
    error?: string;
  };
  message?: string;
}

/**
 * API error response from RTK Query
 */
export interface ApiErrorResponse {
  status: number;
  data: {
    message?: string;
    errors?: Record<string, string | string[]>;
    error?: string;
  };
}

/**
 * Base API response structure
 */
export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
  has_next?: boolean;
  has_prev?: boolean;
  [key: string]: unknown;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("status" in error || "data" in error)
  );
}

/**
 * Type guard to check if response is a successful API response
 */
export function isApiResponse<T>(
  response: unknown,
): response is ApiResponse<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    ("success" in response || "message" in response || "data" in response)
  );
}

/**
 * Type guard to check if response is a paginated response
 */
export function isPaginatedResponse<T>(
  response: unknown,
): response is PaginatedResponse<T> {
  return (
    isApiResponse<T[]>(response) &&
    Array.isArray(response.data) &&
    response.meta !== undefined &&
    typeof response.meta === "object" &&
    response.meta !== null
  );
}

// ─── Order Types ────────────────────────────────────────────────────────────

export type DocumentStatus = 'published' | 'process' | 'completed' | 'cancelled';
export type FulfillmentStatus = 'new' | 'completed';
export type PaymentStatus = 'unpaid' | 'paid';

export interface PaymentMethod {
  id: string;
  franchisor_id: string;
  name: string;
  provider: string;
  type: string;
  account_name: string;
  account_number: string;
  is_member_payment: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  redirect_url?: string;
  qr_code?: string;
  status?: string;
  [key: string]: unknown;
}

export interface SalesOrderItem {
  id: string;
  catalog_id: string;
  item_id?: string;
  fraction_id?: string;
  parent_id?: string;
  quantity_ordered: number;
  quantity_fulfilled: number;
  unit_base: number;
  unit_nett: number;
  unit_gross: number;
  unit_tax: number;
  unit_taxed: number;
  bundle_id?: number;
  catalog?: { name: string };
  item?: { name: string };
}

export interface Order {
  id: string;
  franchisor_id: string;
  code: string;
  ref_code?: string;
  outlet_id: string;
  warehouse_id: string;
  warehouse_name?: string;
  order_type: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_region_id: string;
  payment_method_id: string;
  document_status: DocumentStatus;
  fulfillment_status: FulfillmentStatus;
  payment_status: PaymentStatus;
  subtotal_base: number;
  subtotal_gross: number;
  subtotal_tax: number;
  subtotal_taxed: number;
  subtotal_nett: number;
  shipping_charges: number;
  total_charges: number;
  shipping_date?: string;
  void_note?: string;
  note?: string;
  fulfilled_at?: string;
  paid_at?: string;
  payment_expired_at?: string;
  self_pickup: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  outlet?: Record<string, unknown>;
  region?: Record<string, unknown>;
  payment_method?: PaymentMethod;
  payment?: PaymentTransaction | null;
  items?: SalesOrderItem[];
}

export interface OrderResponse {
  data: Order[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
