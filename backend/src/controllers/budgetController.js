import { query } from '../config/db.js';
export async function getBudget(req, res, next) {
  try {
    const trip = await query('SELECT id, start_date, end_date, budget_limit AS "budgetLimit", currency FROM trips WHERE id=$1 AND user_id=$2', [req.params.tripId,req.user.id]);
    if (!trip.rowCount) return res.status(404).json({ message: 'Trip not found.' });
    const expenses = await query(`SELECT category, COALESCE(SUM(amount),0) AS total FROM expenses WHERE trip_id=$1 GROUP BY category`,[req.params.tripId]);
    const activity = await query(`SELECT COALESCE(SUM(COALESCE(sa.custom_cost,a.estimated_cost)),0) AS total FROM stop_activities sa JOIN trip_stops s ON s.id=sa.trip_stop_id JOIN activities a ON a.id=sa.activity_id WHERE s.trip_id=$1`,[req.params.tripId]);
    const breakdown = { transport:0, stay:0, food:0, other:0, activities:Number(activity.rows[0].total) };
    expenses.rows.forEach((row)=>{ breakdown[row.category]=Number(row.total); });
    const total=Object.values(breakdown).reduce((sum,value)=>sum+value,0); const t=trip.rows[0]; const days=Math.max(1,Math.round((new Date(t.end_date)-new Date(t.start_date))/86400000)+1);
    return res.json({ breakdown, total, currency: t.currency || 'INR', budgetLimit:t.budgetLimit === null ? null : Number(t.budgetLimit), remaining:t.budgetLimit === null ? null : Number(t.budgetLimit)-total, averagePerDay:total/days });
  } catch (error) { return next(error); }
}
