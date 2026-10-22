import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let dbInstance = null;

export const getDB = async () => {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabase({ name: 'habits.db', location: 'default' });

  // Habit definitions
  await dbInstance.executeSql(`
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      frequency TEXT DEFAULT 'daily',   -- 'daily' | 'weekly'
      target_per_week INTEGER DEFAULT 7,
      created_at INTEGER,
      updated_at INTEGER,
      archived INTEGER DEFAULT 0,
      sync_status TEXT DEFAULT 'pending_insert'
    );
  `);

  // Daily completion log
  await dbInstance.executeSql(`
    CREATE TABLE IF NOT EXISTS habit_logs (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL,
      user_id TEXT,
      date TEXT NOT NULL,                -- 'YYYY-MM-DD'
      completed INTEGER DEFAULT 1,
      note TEXT,
      updated_at INTEGER,
      sync_status TEXT DEFAULT 'pending_insert',
      UNIQUE(habit_id, date)
    );
  `);

  // Index for fast "today" and "range" queries
  await dbInstance.executeSql(
    `CREATE INDEX IF NOT EXISTS idx_logs_habit_date ON habit_logs(habit_id, date);`
  );
  await dbInstance.executeSql(
    `CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id, archived);`
  );
  await dbInstance.executeSql(
    `CREATE INDEX IF NOT EXISTS idx_logs_user_habit_date ON habit_logs(user_id, habit_id, date);`
  );

  return dbInstance;
};
