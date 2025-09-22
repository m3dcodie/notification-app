// Utility functions to build SQL queries for user registration and preferences

export function buildRegisterUserQuery(user: {
  user_id: string;
  email_address: string;
  country_code: string;
  phone_number: string;
  created_at: string;
}) {
  return `INSERT INTO User (user_id, email_address, country_code, phone_number, created_at)
    VALUES ('${user.user_id}', '${user.email_address}', '${user.country_code}', '${user.phone_number}', '${user.created_at}');`;
}

export function buildUpdatePreferencesQuery(pref: {
  user_pref_id: string;
  channel: string;
  frequency: string;
  optin: boolean;
  fk_user_id: string;
}) {
  return `UPDATE User_prefrences SET channel='${pref.channel}', frequency='${pref.frequency}', optin=${pref.optin}
    WHERE fk_user_id='${pref.fk_user_id}' AND user_pref_id='${pref.user_pref_id}';`;
}

export function buildInsertPreferencesQuery(pref: {
  user_pref_id: string;
  channel: string;
  frequency: string;
  optin: boolean;
  fk_user_id: string;
}) {
  return `INSERT INTO User_prefrences (user_pref_id, channel, frequency, optin, fk_user_id)
    VALUES ('${pref.user_pref_id}', '${pref.channel}', '${pref.frequency}', ${pref.optin}, '${pref.fk_user_id}');`;
}

// For race condition handling, you would use transactions and row-level locking in actual implementation.
export function buildPreferencesLockQuery(fk_user_id: string) {
  return `SELECT * FROM User_prefrences WHERE fk_user_id='${fk_user_id}' FOR UPDATE;`;
}
