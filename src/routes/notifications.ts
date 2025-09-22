
import { Router } from 'express';
import {
  sendNotification,
  getNotificationStatus,
  listNotifications
} from '../controllers/notificationController';

const router = Router();

router.post('/', sendNotification);
router.get('/:id', getNotificationStatus);
router.get('/', listNotifications);

export default router;
