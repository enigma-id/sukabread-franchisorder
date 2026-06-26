/**
 * Warehouse definition
 */
export interface Warehouse {
  id: string;
  brand_id: string;
  type: string;
  name: string;
  address: string;
  region_id: string;
  is_default: boolean;
  is_active: boolean;
  has_area: boolean;
  created_by: string;
  created_at: string; // Note: Go 'zero time' appears as 0001-01-01T00:00:00Z
}
