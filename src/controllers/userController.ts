import { Request, Response } from 'express';
import { buildRegisterUserQuery, buildUpdatePreferencesQuery, buildInsertPreferencesQuery, buildPreferencesLockQuery } from '../db/postgres';
const { v4: uuidv4 } = require('uuid');
import { RegisterUserRequest, UpdatePreferencesRequest } from '../types/userRequest';

export const registerUser = (req: Request<{}, {}, RegisterUserRequest>, res: Response) => {
  const { email_address, country_code, phone_number } = req.body;
  const missingFields = [];
  if (!email_address) missingFields.push('email_address');
  if (!country_code) missingFields.push('country_code');
  if (!phone_number) missingFields.push('phone_number');
  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
 }
  const user = {
    user_id: uuidv4(),
    email_address,
    country_code,
    phone_number,
    created_at: new Date().toISOString(),
  };
  const sql = buildRegisterUserQuery(user);
  // Mock DB response
  // In real implementation, execute SQL query and handle errors
  return res.status(201).json({ message: 'User registered', user, sql });
};

export const updatePreferences = (req: Request<{ id: string }, {}, UpdatePreferencesRequest>, res: Response) => {
  const { channel, frequency, optin } = req.body;
  const fk_user_id = req.params.id;
  if (!channel || !frequency || typeof optin !== 'boolean') {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  // Simulate race condition handling: lock row for update
  const lockSql = buildPreferencesLockQuery(fk_user_id);
  // Simulate checking if preferences exist
  const preferencesExist = Math.random() > 0.5; // Mock: randomly decide if preferences exist
  let sql;
  if (preferencesExist) {
    // Update existing preferences
    sql = buildUpdatePreferencesQuery({
      user_pref_id: uuidv4(), // In real DB, fetch actual pref ID
      channel,
      frequency,
      optin,
      fk_user_id,
    });
  } else {
    // Insert new preferences
    sql = buildInsertPreferencesQuery({
      user_pref_id: uuidv4(),
      channel,
      frequency,
      optin,
      fk_user_id,
    });
  }
  // Mock DB response
  return res.json({ message: 'Preferences updated', sql, lockSql });
};

export const getUserDetails = (req: Request, res: Response) => {
  // TODO: Implement get user details logic
  res.json({ message: 'User details', userId: req.params.id });
};

export const registerDevice = (req: Request, res: Response) => {
  // TODO: Implement device registration logic
  res.status(201).json({ message: 'Device registered', device: req.body });
};

export const registerWebhook = (req: Request, res: Response) => {
  // TODO: Implement webhook registration logic
  res.status(201).json({ message: 'Webhook registered', webhook: req.body });
};
