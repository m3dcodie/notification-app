export interface RegisterUserRequest {
  email_address: string;
  country_code: string;
  phone_number: string;
}

export interface UpdatePreferencesRequest {
  channel: string;
  frequency: string;
  optin: boolean;
}
