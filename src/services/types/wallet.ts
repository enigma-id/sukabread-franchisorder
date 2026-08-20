export interface BalanceLog {
  id: string;
  brand_id: string;
  outlet_id: string;
  reference_id: string;
  reference_type: string;
  nominal: number;
  balance_before: number;
  balance_after: number;
  created_at: string;
}

export interface TopupRequest {
  id: string;
  franchisor_id: string;
  outlet_id: string;
  ref_id: string;
  code: string;
  amount: number;
  payment_method_id: string;
  payment_method?: {
    id: string;
    name: string;
    provider: string;
  };
  document_status: string;
  rejected_reason: string;
  processed_by: string;
  processed_at: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  outlet: {
    id: string;
    franchisor_id: string;
    outlet_type_id: string;
    name: string;
    recipient_name: string;
    phone: string;
    address: string;
    service_charges: number;
    saldo: number;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface WithdrawalRequest {
  id: string;
  franchisor_id: string;
  ref_id: string;
  outlet_id: string;
  code: string;
  amount: number;
  balance_at_request: number;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  notes: string;
  document_status: string;
  rejected_reason: string;
  processed_by: string;
  processed_at: string;
  is_deleted: boolean;
  updated_by: string;
  created_at: string;
  updated_at: string;
  outlet: {
    id: string;
    franchisor_id: string;
    outlet_type_id: string;
    name: string;
    recipient_name: string;
    phone: string;
    address: string;
    service_charges: number;
    saldo: number;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface PaginatedResponse<T> {
  status: number;
  message: string;
  data: T[];
  error: string[];
  pagination: {
    limit: number;
    offset: number;
    has_next: boolean;
    total_pages: number;
    total_data: number;
  };
}
