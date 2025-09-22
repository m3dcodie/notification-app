// Mock external API calls for notification channels

export async function sendEmail(payload: any): Promise<{ success: boolean; error?: string }> {
  // Simulate random failure
  if (Math.random() < 0.7) {
    return { success: true };
  } else {
    return { success: false, error: 'Email service failed' };
  }
}

export async function sendWebhook(payload: any): Promise<{ success: boolean; error?: string }> {
  // Simulate random failure
  if (Math.random() < 0.8) {
    return { success: true };
  } else {
    return { success: false, error: 'Webhook service failed' };
  }
}
