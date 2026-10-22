import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from 'react';
  import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
  } from '@react-native-firebase/auth';

  const firebaseAuth = getAuth();
  
  export const AuthContext = createContext(null);
  
  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userToken, setUserToken] = useState(null); // Firebase ID token
    const [isLoading, setIsLoading] = useState(true);
  
    // Listen to Firebase auth state. Fires immediately with the cached user
    // (or null), so the app can skip a network round-trip on cold start.
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
        if (fbUser) {
          try {
            const token = await fbUser.getIdToken();
            setUser(fbUser);
            setUserToken(token);
          } catch (e) {
            // Cached user exists but token refresh failed (rare, e.g. revoked).
            console.warn('[Auth] failed to get token:', e);
            setUser(fbUser);
            setUserToken(null);
          }
        } else {
          setUser(null);
          setUserToken(null);
        }
        setIsLoading(false);
      });
  
      return unsubscribe;
    }, []);
  
    // Refresh the ID token periodically so Firestore writes don't 401 after
    // the ~1h expiry. Firebase auto-refreshes on network activity, but we
    // also refresh on focus for safety when the app has been offline.
    useEffect(() => {
      if (!user) return;
      let cancelled = false;
      const refresh = async () => {
        try {
          const token = await user.getIdToken(true);
          if (!cancelled) setUserToken(token);
        } catch (e) {
          // Offline — keep the old token, Firestore SDK will retry later.
        }
      };
      const interval = setInterval(refresh, 50 * 60 * 1000); // every 50 min
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }, [user]);
  
    const login = useCallback(async (email, password) => {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return cred.user;
    }, []);
  
    const register = useCallback(async (email, password) => {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      return cred.user;
    }, []);
  
    const logout = useCallback(async () => {
      try {
        await signOut(firebaseAuth);
      } catch (e) {
        console.warn('[Auth] signOut error:', e);
      }
    }, []);
  
    const value = useMemo(
      () => ({
        user,
        userToken,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
      }),
      [user, userToken, isLoading, login, register, logout]
    );
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
  };
