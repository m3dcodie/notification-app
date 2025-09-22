
import { Router } from 'express';
import {
  registerUser,
  updatePreferences,
  getUserDetails,
  registerDevice,
  registerWebhook
} from '../controllers/userController';

const router = Router();

router.post('/', registerUser);
router.put('/:id/preferences', updatePreferences);
router.get('/:id', getUserDetails);
router.post('/:id/devices', registerDevice);
router.post('/:id/webhooks', registerWebhook);

export default router;
