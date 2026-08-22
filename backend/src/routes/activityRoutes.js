import { Router } from 'express';
import { addStopActivity, deleteStopActivity, getActivities } from '../controllers/activityController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/activities', getActivities);
router.post('/stops/:stopId/activities', requireAuth, addStopActivity);
router.delete('/stop-activities/:id', requireAuth, deleteStopActivity);
export default router;
