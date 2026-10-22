import { getAuth } from '@react-native-firebase/auth';
import { collection, doc, getDocs, getFirestore, setDoc } from '@react-native-firebase/firestore';
import { getDB } from '../db/sqlite';

const uid = () => getAuth().currentUser?.uid;
const dbFirestore = getFirestore();

const pushTable = async (db, user, { table, collection: collectionPath, toFirestore }) => {
  const [res] = await db.executeSql(
    `SELECT * FROM ${table} WHERE user_id = ? AND sync_status != 'synced'`,
    [user]
  );
  for (let i = 0; i < res.rows.length; i++) {
    const row = res.rows.item(i);
    const ref = doc(dbFirestore, collectionPath, row.id);

    if (row.sync_status === 'pending_delete') {
      // A tombstone lets another device learn about the deletion.
      await setDoc(ref, { deleted: true, updated_at: row.updated_at }, { merge: true });
      await db.executeSql(`DELETE FROM ${table} WHERE id = ?`, [row.id]);
      continue;
    }

    await setDoc(ref, toFirestore(row), { merge: true });
    await db.executeSql(
      `UPDATE ${table} SET sync_status = 'synced' WHERE id = ?`,
      [row.id]
    );
  }
};

export const syncWithFirestore = async () => {
  const user = uid();
  if (!user) return;
  const db = await getDB();

  // --- Habits ---
  await pushTable(db, user, {
    table: 'habits',
    collection: `users/${user}/habits`,
    toFirestore: (r) => ({
      name: r.name,
      description: r.description,
      icon: r.icon,
      color: r.color,
      frequency: r.frequency,
      target_per_week: r.target_per_week,
      archived: !!r.archived,
      deleted: false,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }),
  });

  // --- Habit logs ---
  await pushTable(db, user, {
    table: 'habit_logs',
    collection: `users/${user}/habit_logs`,
    toFirestore: (r) => ({
      habit_id: r.habit_id,
      date: r.date,
      completed: !!r.completed,
      note: r.note,
      deleted: false,
      updated_at: r.updated_at,
    }),
  });
};

export const pullFromFirestore = async () => {
  const user = uid();
  if (!user) return;
  const db = await getDB();

  // Pull habits
  const habitsSnap = await getDocs(collection(dbFirestore, `users/${user}/habits`));

  for (const snapshot of habitsSnap.docs) {
    const d = snapshot.data();
    const [existing] = await db.executeSql(
      `SELECT updated_at, sync_status FROM habits WHERE id = ?`,
      [snapshot.id]
    );
    const local = existing.rows.length ? existing.rows.item(0) : null;
    if (local && local.sync_status !== 'synced') continue;        // don't clobber local edits
    if (local && local.updated_at >= (d.updated_at || 0)) continue;

    if (d.deleted) {
      if (local) await db.executeSql(`DELETE FROM habits WHERE id = ?`, [snapshot.id]);
      continue;
    }

    await db.executeSql(
      `INSERT OR REPLACE INTO habits
       (id, user_id, name, description, icon, color, frequency, target_per_week,
        created_at, updated_at, archived, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')`,
      [
        snapshot.id, user, d.name, d.description ?? null, d.icon ?? null, d.color ?? null,
        d.frequency ?? 'daily', d.target_per_week ?? 7,
        d.created_at ?? Date.now(), d.updated_at ?? Date.now(),
        d.archived ? 1 : 0,
      ]
    );
  }

  // Pull habit logs
  const logsSnap = await getDocs(collection(dbFirestore, `users/${user}/habit_logs`));

  for (const snapshot of logsSnap.docs) {
    const d = snapshot.data();
    const [existing] = await db.executeSql(
      `SELECT updated_at, sync_status FROM habit_logs WHERE id = ?`,
      [snapshot.id]
    );
    const local = existing.rows.length ? existing.rows.item(0) : null;
    if (local && local.sync_status !== 'synced') continue;
    if (local && local.updated_at >= (d.updated_at || 0)) continue;

    if (d.deleted) {
      if (local) await db.executeSql(`DELETE FROM habit_logs WHERE id = ?`, [snapshot.id]);
      continue;
    }

    await db.executeSql(
      `INSERT OR REPLACE INTO habit_logs
       (id, habit_id, user_id, date, completed, note, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'synced')`,
      [
        snapshot.id, d.habit_id, user, d.date,
        d.completed ? 1 : 0, d.note ?? null, d.updated_at ?? Date.now(),
      ]
    );
  }
};
