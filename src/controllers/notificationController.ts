import { Request, Response } from 'express';
import { NotificationService } from '../utils/NotificationService';
import { EmailChannel, WebhookChannel } from '../utils/NotificationChannel';
import { getIdempotencyResult, setIdempotencyResult } from '../db/redis';

const notificationService = new NotificationService({
  email: new EmailChannel(),
  webhook: new WebhookChannel(),
});

export const sendNotification = async (req: Request, res: Response) => {
  const { channel, payload } = req.body;
  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!channel || !payload) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (!idempotencyKey) {
    return res.status(400).json({ message: 'Missing Idempotency-Key header' });
  }

  // Check for existing result
  const existing = await getIdempotencyResult(idempotencyKey);
  if (existing) {
    return res.status(existing.status).json(existing.response);
  }

  const logs: string[] = [];
  const logger = (msg: string) => logs.push(msg);
  const result = await notificationService.send(channel, payload, logger);

  // Store result for future duplicate requests
  await setIdempotencyResult(idempotencyKey, {
    status: result.success ? 201 : 500,
    response: result.success
      ? { message: 'Notification sent', channel, attempt: result.attempt, logs }
      : { message: 'Notification failed', channel, error: result.error, attempt: result.attempt, logs },
  });

  if (result.success) {
    return res.status(201).json({ message: 'Notification sent', channel, attempt: result.attempt, logs });
  } else {
    return res.status(500).json({ message: 'Notification failed', channel, error: result.error, attempt: result.attempt, logs });
  }
};

export const getNotificationStatus = (req: Request, res: Response) => {
  // TODO: Implement get notification status logic
  res.json({ message: 'Notification status', notificationId: req.params.id });
};

export const listNotifications = (req: Request, res: Response) => {
  // TODO: Implement list notifications logic
  res.json({ message: 'List of notifications' });
};
