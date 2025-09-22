export interface User {
  user_id: string;
  email_address: string;
  country_code: string;
  phone_number: string;
  created_at: string;
}

export interface UserPreference {
  user_pref_id: string;
  channel: string;
  frequency: string;
  optin: boolean;
  fk_user_id: string;
}

export interface Device {
  device_id: number;
  device_token: string;
  fk_user_id: string;
  status: boolean;
}

export interface Webhook {
  webhook_id: number;
  url: string;
  fk_user_id: string;
  status: boolean;
}
