import { findActivitiesByCity } from '../models/Activity.js';
import { addActivityToStop, removeActivityFromStop } from '../models/StopActivity.js';
import { query } from '../config/db.js';

export async function getActivities(req, res, next) {
  try {
    const { cityId, search, category, maxCost, maxDuration } = req.query;
    if (!cityId) return res.status(400).json({ message: 'cityId query parameter is required.' });
    const filters = { search: search?.trim(), category: category?.trim() };
    if (maxCost !== undefined && Number.isFinite(Number(maxCost))) filters.maxCost = Number(maxCost);
    if (maxDuration !== undefined && Number.isFinite(Number(maxDuration))) filters.maxDuration = Number(maxDuration);
    return res.json({ activities: await findActivitiesByCity(cityId, filters) });
  } catch (error) { return next(error); }
}

export async function reorderStopActivity(req, res, next) {
  try {
    const activityOrder = Number(req.body.activityOrder);
    if (!Number.isInteger(activityOrder) || activityOrder < 1) return res.status(400).json({ message: 'activityOrder must be a positive integer.' });
    const result = await query(`UPDATE stop_activities sa SET activity_order=$1 FROM trip_stops s JOIN trips t ON t.id=s.trip_id WHERE sa.id=$2 AND sa.trip_stop_id=s.id AND t.user_id=$3 RETURNING sa.id, sa.activity_order AS "activityOrder"`, [activityOrder, req.params.stopActivityId, req.user.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Stop activity not found.' });
    return res.json({ stopActivity: result.rows[0] });
  } catch (error) { return next(error); }
}

export async function addStopActivity(req, res, next) {
  try {
    const { activityId, scheduledDate = null, scheduledTime = null, customCost = null } = req.body;
    const normalizedDate = scheduledDate === '' ? null : scheduledDate;
    const normalizedTime = scheduledTime === '' ? null : scheduledTime;
    if (!activityId) return res.status(400).json({ message: 'activityId is required.' });
    if (customCost !== null && (!Number.isFinite(Number(customCost)) || Number(customCost) < 0)) {
      return res.status(400).json({ message: 'customCost must be a non-negative number.' });
    }
    const stopActivity = await addActivityToStop({ stopId: req.params.stopId, activityId, scheduledDate: normalizedDate, scheduledTime: normalizedTime, customCost, userId: req.user.id });
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
