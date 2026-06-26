export interface SigninRequest {
  identifier: string;
  password?: string;
}

export interface AuthUser {
  id: string;
  franchisor_id: string;
  usergroup_id: string;
  outlet_id: string;
  username: string;
  name: string;
  is_active: boolean;
  is_deleted: boolean;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string; // Note: Go 'zero time' appears as 0001-01-01T00:00:00Z
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
}

export interface SeamlessRequest {
  identifier: string;
  token: string;
}
