/**
 * Catalog item definition
 */
export interface CatalogItem {
  id: string;
  franchisor_id: string;
  code: string;
  name: string;
  is_bundle: boolean;
  item_id: string;
  fraction_id: string;
  base_price: number;
  unit_price: number;
  weight: number;
  volume: number;
  measurement: string;
  unit: number;
  image: string;
  is_active: boolean;
  is_vatable: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}
