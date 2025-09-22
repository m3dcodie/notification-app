export interface NotificationChannel {
  send(payload: any): Promise<{ success: boolean; error?: string }>;
}

export class EmailChannel implements NotificationChannel {
  async send(payload: any): Promise<{ success: boolean; error?: string }> {
    // Mocked email sending logic
    if (Math.random() < 0.7) {
      return { success: true };
    } else {
      return { success: false, error: 'Email service failed' };
    }
  }
}

export class WebhookChannel implements NotificationChannel {
  async send(payload: any): Promise<{ success: boolean; error?: string }> {
    // Mocked webhook sending logic
    if (Math.random() < 0.8) {
      return { success: true };
    } else {
      return { success: false, error: 'Webhook service failed' };
    }
  }
}
