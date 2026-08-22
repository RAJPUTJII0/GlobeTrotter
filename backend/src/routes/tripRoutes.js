import { Router } from 'express';
import { createTrip, deleteTrip, getTrips } from '../controllers/tripController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = Router();
router.use(requireAuth);
router.route('/').get(getTrips).post(createTrip);
router.delete('/:tripId', deleteTrip);
export default router;
