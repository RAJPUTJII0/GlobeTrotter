import { query } from '../config/db.js';

async function assertTrip(tripId, userId) {
  const result = await query('SELECT id FROM trips WHERE id=$1 AND user_id=$2', [tripId, userId]);
  return result.rowCount > 0;
}
export async function getExpenses(req, res, next) {
  try { if (!(await assertTrip(req.params.tripId, req.user.id))) return res.status(404).json({ message: 'Trip not found.' });
    const result = await query('SELECT id, trip_id AS "tripId", category, amount, note, created_at AS "createdAt" FROM expenses WHERE trip_id=$1 ORDER BY created_at DESC', [req.params.tripId]); return res.json({ expenses: result.rows });
  } catch (error) { return next(error); }
}
export async function createExpense(req, res, next) {
  try { const { category, amount, note = null } = req.body;
    if (!['transport','stay','food','other'].includes(category) || !Number.isFinite(Number(amount)) || Number(amount) < 0) return res.status(400).json({ message: 'Valid category and non-negative amount are required.' });
    if (!(await assertTrip(req.params.tripId, req.user.id))) return res.status(404).json({ message: 'Trip not found.' });
    const result = await query('INSERT INTO expenses (trip_id,category,amount,note) VALUES ($1,$2,$3,$4) RETURNING id, trip_id AS "tripId", category, amount, note, created_at AS "createdAt"', [req.params.tripId,category,amount,note]); return res.status(201).json({ expense: result.rows[0] });
  } catch (error) { return next(error); }
}
export async function deleteExpense(req, res, next) {
  try { const result = await query('DELETE FROM expenses e USING trips t WHERE e.id=$1 AND e.trip_id=$2 AND t.id=e.trip_id AND t.user_id=$3 RETURNING e.id', [req.params.expenseId,req.params.tripId,req.user.id]); if (!result.rowCount) return res.status(404).json({ message: 'Expense not found.' }); return res.status(204).send(); } catch (error) { return next(error); }
}
