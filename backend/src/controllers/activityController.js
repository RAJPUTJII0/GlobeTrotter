import { findActivitiesByCity } from '../models/Activity.js';
import { addActivityToStop, removeActivityFromStop } from '../models/StopActivity.js';

export async function getActivities(req, res, next) {
  try {
    const { cityId } = req.query;
    if (!cityId) return res.status(400).json({ message: 'cityId query parameter is required.' });
    return res.json({ activities: await findActivitiesByCity(cityId) });
  } catch (error) { return next(error); }
}

export async function addStopActivity(req, res, next) {
  try {
    const { activityId, scheduledDate = null, scheduledTime = null, customCost = null } = req.body;
    if (!activityId) return res.status(400).json({ message: 'activityId is required.' });
    if (customCost !== null && (!Number.isFinite(Number(customCost)) || Number(customCost) < 0)) {
      return res.status(400).json({ message: 'customCost must be a non-negative number.' });
    }
    const stopActivity = await addActivityToStop({ stopId: req.params.stopId, activityId, scheduledDate, scheduledTime, customCost, userId: req.user.id });
    if (!stopActivity) return res.status(404).json({ message: 'Trip stop or city activity not found.' });
    return res.status(201).json({ stopActivity });
  } catch (error) { return next(error); }
}

export async function deleteStopActivity(req, res, next) {
  try {
    const deleted = await removeActivityFromStop({ stopActivityId: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Stop activity not found.' });
    return res.status(204).send();
  } catch (error) { return next(error); }
}
