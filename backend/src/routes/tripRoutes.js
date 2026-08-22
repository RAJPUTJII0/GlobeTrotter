import { Router } from 'express';
import { createTrip, getTrips } from '../controllers/tripController.js';
const router = Router();
router.route('/').get(getTrips).post(createTrip);
export default router;
