import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/user';

const app = express();
app.use(express.json());
app.use('/user', userRoutes);

describe('User API', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/user')
      .send({ email_address: 'test@example.com', country_code: 'US', phone_number: '1234567890' });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered');
    expect(res.body.user.email_address).toBe('test@example.com');
    expect(res.body.sql).toContain('INSERT INTO User');
  });

  it('should fail registration with missing fields', async () => {
    const res = await request(app)
      .post('/user')
      .send({ email_address: 'test@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Missing required fields');
  });

  it('should update user preferences', async () => {
    const res = await request(app)
      .put('/user/1/preferences')
      .send({ channel: 'email', frequency: 'daily', optin: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Preferences updated');
    expect(res.body.sql).toMatch(/(INSERT INTO User_prefrences|UPDATE User_prefrences)/);
    expect(res.body.lockSql).toContain('FOR UPDATE');
  });


  it('should fail to update preferences with missing fields', async () => {
    const res = await request(app)
      .put('/user/1/preferences')
      .send({ channel: 'email', frequency: 'daily' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Missing required fields');
  });
});
