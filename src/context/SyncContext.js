import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { getDB } from '../db/sqlite';
import { syncWithFirestore, pullFromFirestore } from '../services/syncService';
import { useAuth } from './AuthContext';

const SyncContext = createContext(null);

export const SyncProvider = ({ children }) => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const syncingRef = useRef(false);

  const refreshPendingCount = useCallback(async () => {
    const db = await getDB();
    if (!user) {
      setPendingCount(0);
      return;
    }
    const [res] = await db.executeSql(`
      SELECT
        (SELECT COUNT(*) FROM habits     WHERE user_id = ? AND sync_status != 'synced') +
        (SELECT COUNT(*) FROM habit_logs WHERE user_id = ? AND sync_status != 'synced') AS c
    `, [user.uid, user.uid]);
    setPendingCount(res.rows.item(0).c || 0);
  }, [user]);

  const runSync = useCallback(async () => {
    if (!user || syncingRef.current) return;
    syncingRef.current = true;
    setIsSyncing(true);
    try {
      await syncWithFirestore();
      await pullFromFirestore();
      await refreshPendingCount();
    } catch (e) {
      console.warn('[Sync] failed:', e);
    } finally {
      syncingRef.current = false;
      setIsSyncing(false);
    }
  }, [user, refreshPendingCount]);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      const online = !!state.isConnected && state.isInternetReachable !== false;
      setIsOnline(online);
      if (online) runSync();
    });
    refreshPendingCount();
    return () => unsub();
  }, [runSync, refreshPendingCount]);

  useEffect(() => {
    if (user && isOnline) runSync();
  }, [user, isOnline, runSync]);

  return (
    <SyncContext.Provider
      value={{ isOnline, isSyncing, pendingCount, runSync, refreshPendingCount }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncStatus = () => {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSyncStatus must be used inside SyncProvider');
  return ctx;
};
