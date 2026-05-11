/** RTK Query-style API error shape */
export interface ApiError {
  status?: number | string;
  data?: {
    message?: string;
    error?: string;
    errors?: Record<string, string | string[]>;
  };
  message?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: "owner" | "manager" | "admin";
}

export interface Outlet {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface Franchise {
  id: string;
  name: string;
}

export interface CatalogItem {
  catalog: {
    id: number;
    code: string;
    name: string;
    unit_price: number;
    image: string;
    weight: number;
    volume: number;
    is_bundle: 0 | 1;
    description: string;
  };
}

export interface CartItem {
  catalog_id: number;
  quantity: number;
}

export interface Bank {
  id: number;
  name: string;
  alias_name: string;
  account_name: string;
  account_number: string;
  is_payment_gateway: 0 | 1;
}

export interface Order {
  id: number;
  code: string;
  items: any[];
  total_bill: number;
  order_status: string;
  delivery_status: string;
  payment_status: string;
  shipping_charges: number;
  ordered_at: string;
  shipping_date: string;
  bank?: Bank;
  note?: string;
  payment_expired_at?: string;
  payment_url?: string;
  is_payment_gateway?: number;
  subtotal_gross?: number;
  expedisi?: string;
}
