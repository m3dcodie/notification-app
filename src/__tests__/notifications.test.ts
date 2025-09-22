import request from 'supertest';
import express from 'express';
import notificationRoutes from '../routes/notifications';

const app = express();
app.use(express.json());
app.use('/notifications', notificationRoutes);

describe('Notification API', () => {
  it('should send an email notification (success or fail with retries)', async () => {
    const res = await request(app)
      .post('/notifications')
      .set('Idempotency-Key', 'test-key-1')
      .send({ channel: 'email', payload: { to: 'user@example.com', subject: 'Test', body: 'Hello' } });
    expect(['Notification sent', 'Notification failed']).toContain(res.body.message);
    expect(res.body.channel).toBe('email');
    expect(res.body.logs.length).toBeGreaterThan(0);
    expect(res.body.attempt).toBeGreaterThan(0);
  });

  it('should send a webhook notification (success or fail with retries)', async () => {
    const res = await request(app)
      .post('/notifications')
      .set('Idempotency-Key', 'test-key-2')
      .send({ channel: 'webhook', payload: { url: 'https://example.com/webhook', data: { foo: 'bar' } } });
    expect(['Notification sent', 'Notification failed']).toContain(res.body.message);
    expect(res.body.channel).toBe('webhook');
    expect(res.body.logs.length).toBeGreaterThan(0);
    expect(res.body.attempt).toBeGreaterThan(0);
  });

  it('should fail for unsupported channel', async () => {
    const res = await request(app)
      .post('/notifications')
      .set('Idempotency-Key', 'test-key-3')
      .send({ channel: 'sms', payload: { to: '+1234567890', body: 'Test' } });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Notification failed');
    expect(res.body.error).toBe('Unsupported channel');
  });

  it('should fail with missing fields', async () => {
    const res = await request(app)
      .post('/notifications')
      .set('Idempotency-Key', 'test-key-4')
      .send({ channel: 'email' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Missing required fields');
  });
});
