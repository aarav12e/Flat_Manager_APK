import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/api";
import { registerForPushNotificationsAsync } from "../services/notifications";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncPushToken = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await api.savePushToken(token);
      }
    } catch (err) {
      console.log("Push token sync failed:", err.message);
    }
  };

  useEffect(() => {
    (async () => {
      const session = await api.getSession();
      setUser(session);
      setLoading(false);
      if (session) {
        syncPushToken();
      }
    })();
  }, []);

  const login = async (phone, password) => {
    const u = await api.login(phone, password);
    setUser(u);
    syncPushToken();
    return u;
  };

  const register = async (payload) => {
    const u = await api.register(payload);
    setUser(u);
    syncPushToken();
    return u;
  };

  const logout = async () => {
    try {
      await api.savePushToken(null);
    } catch (err) {
      console.log("Could not clear push token on logout:", err.message);
    }
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
