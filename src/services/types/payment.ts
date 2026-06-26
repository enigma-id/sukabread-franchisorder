/**
 * Payment method definition
 */
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
