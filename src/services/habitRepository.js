import { getDB } from '../db/sqlite';
import { formatDate } from '../utils/date';

const now = () => Date.now();

/**
 * Returns habits (non-archived) with today's completion state joined.
 */
export const getTodayHabits = async (userId, dateStr) => {
  const db = await getDB();
  const [res] = await db.executeSql(
    `SELECT h.*, l.completed AS today_completed, l.id AS log_id
     FROM habits h
     LEFT JOIN habit_logs l
       ON l.habit_id = h.id AND l.date = ?
     WHERE h.user_id = ? AND h.archived = 0
     ORDER BY h.created_at ASC`,
    [dateStr, userId]
  );
  const out = [];
  for (let i = 0; i < res.rows.length; i++) out.push(res.rows.item(i));
  return out;
};

export const getHabits = async (userId, includeArchived = false) => {
  const db = await getDB();
  const [res] = await db.executeSql(
    `SELECT * FROM habits
     WHERE user_id = ? ${includeArchived ? '' : 'AND archived = 0'}
     ORDER BY created_at ASC`,
    [userId]
  );
  const out = [];
  for (let i = 0; i < res.rows.length; i++) out.push(res.rows.item(i));
  return out;
};

export const getHabit = async (habitId) => {
  const db = await getDB();
  const [res] = await db.executeSql(`SELECT * FROM habits WHERE id = ?`, [habitId]);
  return res.rows.length ? res.rows.item(0) : null;
};

export const createHabit = async (userId, data) => {
  const db = await getDB();
  const id = `${userId}_${now()}_${Math.random().toString(36).slice(2, 8)}`;
  await db.executeSql(
    `INSERT INTO habits
     (id, user_id, name, description, icon, color, frequency, target_per_week,
      created_at, updated_at, archived, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending_insert')`,
    [
      id, userId, data.name, data.description ?? null, data.icon ?? null,
      data.color ?? null, data.frequency ?? 'daily',
      data.target_per_week ?? 7, now(), now(),
    ]
  );
  return id;
};

export const updateHabit = async (habitId, patch) => {
  const db = await getDB();
  const fields = [];
  const values = [];
  const allowedFields = new Set([
    'name', 'description', 'icon', 'color', 'frequency', 'target_per_week', 'archived',
  ]);
  for (const [k, v] of Object.entries(patch)) {
    if (!allowedFields.has(k)) continue;
    fields.push(`${k} = ?`);
    values.push(v);
  }
  if (fields.length === 0) return;
  fields.push(`updated_at = ?`, `sync_status = 'pending_update'`);
  values.push(now(), habitId);
  await db.executeSql(`UPDATE habits SET ${fields.join(', ')} WHERE id = ?`, values);
};

export const deleteHabit = async (habitId) => {
  const db = await getDB();
  await db.executeSql(
    `UPDATE habits SET sync_status = 'pending_delete', updated_at = ? WHERE id = ?`,
    [now(), habitId]
  );
};

/**
 * Toggle a habit completion for a given day.
 * If a log exists → flip its `completed`. If not → insert completed=1.
 */
export const toggleHabitLog = async (userId, habitId, dateStr) => {
  const db = await getDB();
  const [res] = await db.executeSql(
    `SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?`,
    [habitId, dateStr]
  );

  if (res.rows.length === 0) {
    const id = `${habitId}_${dateStr}`;
    await db.executeSql(
      `INSERT INTO habit_logs
       (id, habit_id, user_id, date, completed, note, updated_at, sync_status)
       VALUES (?, ?, ?, ?, 1, NULL, ?, 'pending_insert')`,
      [id, habitId, userId, dateStr, now()]
    );
    return true;
  }

  const row = res.rows.item(0);
  const next = row.completed ? 0 : 1;
  await db.executeSql(
    `UPDATE habit_logs SET completed = ?, updated_at = ?, sync_status = 'pending_update' WHERE id = ?`,
    [next, now(), row.id]
  );
  return !!next;
};

export const getLogsForRange = async (userId, habitId, startDate, endDate) => {
  const db = await getDB();
  const [res] = await db.executeSql(
    `SELECT * FROM habit_logs
     WHERE user_id = ? AND habit_id = ? AND date BETWEEN ? AND ?
     ORDER BY date ASC`,
    [userId, habitId, startDate, endDate]
  );
  const out = [];
  for (let i = 0; i < res.rows.length; i++) out.push(res.rows.item(i));
  return out;
};

export const getStreak = async (userId, habitId) => {
  // Pull last 365 days of logs for streak calc
  const db = await getDB();
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 365);
  const [res] = await db.executeSql(
    `SELECT date, completed FROM habit_logs
     WHERE user_id = ? AND habit_id = ? AND completed = 1
       AND date BETWEEN ? AND ?
     ORDER BY date DESC`,
    [userId, habitId, formatDate(start), formatDate(today)]
  );

  const completedDates = new Set();
  for (let i = 0; i < res.rows.length; i++) completedDates.add(res.rows.item(i).date);

  let streak = 0;
  const cursor = new Date();
  while (completedDates.has(formatDate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};
