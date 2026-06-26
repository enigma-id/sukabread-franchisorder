export interface RegionAdministrativeArea {
  country: string;
  province: string;
  regency: string;
  district?: string;
  village?: string;
  country_id: string;
  province_id: string;
  regency_id: string;
  district_id?: string;
  village_id?: string;
}

export interface RegionDetail {
  id: string;
  parent_id?: string;
  name: string;
  code: string;
  type: string;
  level: number;
  administrative_area: RegionAdministrativeArea;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
