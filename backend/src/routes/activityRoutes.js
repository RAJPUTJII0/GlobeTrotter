import { Router } from 'express';
import { addStopActivity, deleteStopActivity, getActivities, reorderStopActivity } from '../controllers/activityController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/activities', getActivities);
router.post('/stops/:stopId/activities', requireAuth, addStopActivity);
router.delete('/stop-activities/:id', requireAuth, deleteStopActivity);
router.patch('/stops/:stopId/activities/:stopActivityId', requireAuth, reorderStopActivity);
export default router;
