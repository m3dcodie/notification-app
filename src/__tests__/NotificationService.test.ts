import { NotificationService } from '../utils/NotificationService';
import { NotificationChannel } from '../utils/NotificationChannel';

describe('NotificationService', () => {
  it('should send notification successfully on first attempt', async () => {
    const mockChannel: NotificationChannel = {
      send: jest.fn().mockResolvedValue({ success: true })
    };
    const service = new NotificationService({ email: mockChannel }, 3);
    const logs: string[] = [];
    const logger = (msg: string) => logs.push(msg);
    const result = await service.send('email', { to: 'user@example.com' }, logger);
    expect(result.success).toBe(true);
    expect(result.attempt).toBe(1);
    expect(logs[0]).toContain('Attempt 1');
  });

  it('should retry and succeed on second attempt', async () => {
    const mockChannel: NotificationChannel = {
      send: jest.fn()
        .mockResolvedValueOnce({ success: false, error: 'fail' })
        .mockResolvedValueOnce({ success: true })
    };
    const service = new NotificationService({ email: mockChannel }, 3);
    const logs: string[] = [];
    const logger = (msg: string) => logs.push(msg);
    const result = await service.send('email', { to: 'user@example.com' }, logger);
    expect(result.success).toBe(true);
    expect(result.attempt).toBe(2);
    expect(logs.length).toBe(2);
  });

  it('should fail after max retries', async () => {
    const mockChannel: NotificationChannel = {
      send: jest.fn().mockResolvedValue({ success: false, error: 'fail' })
    };
    const service = new NotificationService({ email: mockChannel }, 2);
    const logs: string[] = [];
    const logger = (msg: string) => logs.push(msg);
    const result = await service.send('email', { to: 'user@example.com' }, logger);
    expect(result.success).toBe(false);
    expect(result.attempt).toBe(2);
    expect(result.error).toBe('fail');
    expect(logs.length).toBe(2);
  });

  it('should fail for unsupported channel', async () => {
    const service = new NotificationService({}, 2);
    const logs: string[] = [];
    const logger = (msg: string) => logs.push(msg);
    const result = await service.send('sms', { to: '+1234567890' }, logger);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Unsupported channel');
    expect(logs[0]).toContain('Unsupported channel');
  });
});
