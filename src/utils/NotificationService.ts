import { NotificationChannel } from './NotificationChannel';

export class NotificationService {
  private channels: Record<string, NotificationChannel>;
  private maxRetries: number;

  constructor(channels: Record<string, NotificationChannel>, maxRetries = 3) {
    this.channels = channels;
    this.maxRetries = maxRetries;
  }

  async send(channelName: string, payload: any, logger: (msg: string) => void) {
    const channel = this.channels[channelName];
    if (!channel) {
      logger(`Unsupported channel: ${channelName}`);
      return { success: false, error: 'Unsupported channel' };
    }
    let attempt = 0;
    let lastError = '';
    while (attempt < this.maxRetries) {
      attempt++;
      const result = await channel.send(payload);
      logger(`Attempt ${attempt} for ${channelName}: ${result.success ? 'Success' : 'Failure'}`);
      if (result.success) {
        return { success: true, attempt };
      } else {
        lastError = result.error || 'Unknown error';
      }
    }
    return { success: false, error: lastError, attempt: this.maxRetries };
  }
}
