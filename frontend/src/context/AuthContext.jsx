import { useCallback, useEffect, useMemo, useState } from "react";

import API from "../api/api";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("authUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const saveSession = (accessToken, refreshToken, userData) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setUser(userData);
  };

  const register = useCallback(async (formData) => {
    const res = await API.post("/auth/register/", formData);
    saveSession(res.data.access, res.data.refresh, res.data.user);
    return res.data;
  }, []);

  const login = useCallback(async (formData) => {
    const res = await API.post("/auth/login/", formData);
    saveSession(res.data.access, res.data.refresh, res.data.user);
    return res.data;
  }, []);

  const refreshProfile = useCallback(async (options = {}) => {
    const { markLoading = true } = options;
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
      return null;
    }

    if (markLoading) {
      setLoading(true);
    }

    try {
      const res = await API.get("/auth/profile/");
      localStorage.setItem("authUser", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authUser");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (formData) => {
    const res = await API.put("/auth/profile/", formData);
    localStorage.setItem("authUser", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await API.post("/auth/logout/");
    } catch {
      // Local logout should still happen if the token is already invalid.
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
    setUser(null);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshProfile({ markLoading: false });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshProfile]);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    refreshProfile,
    updateProfile,
  }), [user, loading, register, login, logout, refreshProfile, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
