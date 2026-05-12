import { createContext, useContext, useEffect, useMemo, useState } from "react";

import API from "../api/api";

const AuthContext = createContext(null);

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

  const register = async (formData) => {
    const res = await API.post("/auth/register/", formData);
    saveSession(res.data.access, res.data.refresh, res.data.user);
    return res.data;
  };

  const login = async (formData) => {
    const res = await API.post("/auth/login/", formData);
    saveSession(res.data.access, res.data.refresh, res.data.user);
    return res.data;
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
      return null;
    }

    setLoading(true);

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
  };

  const updateProfile = async (formData) => {
    const res = await API.put("/auth/profile/", formData);
    localStorage.setItem("authUser", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout/");
    } catch {
      // Local logout should still happen if the token is already invalid.
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
    setUser(null);
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    refreshProfile,
    updateProfile,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
