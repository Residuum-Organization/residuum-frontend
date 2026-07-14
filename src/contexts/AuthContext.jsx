import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth";
import { setAccessToken, clearAccessToken, getAccessToken, setRefreshToken, clearRefreshToken } from "../api/token";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return undefined;
    }

    (async () => {
      try {
        const user = await authService.getMeWithToken(token);
        if (user) {
          setUser(user);
          setAuthenticated(true);
        }
      } catch (e) {
        // Se falhar (ex: token expirado), tenta fazer o refresh como fallback
        try {
          const res = await authService.refresh();
          if (res.accessToken) {
            setAccessToken(res.accessToken);
            setUser(res.user);
            setAuthenticated(true);
          }
        } catch (refreshErr) {
          clearAccessToken();
          setUser(null);
          setAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password, rememberMe = true) => {
    // Limpa sessão anterior antes de logar
    clearAccessToken();
    clearRefreshToken();
    setUser(null);
    setAuthenticated(false);

    const res = await authService.login(email, password);
    const { accessToken, refreshToken, user } = res;
    if (accessToken) {
      setAccessToken(accessToken);
      if (rememberMe && refreshToken) {
        setRefreshToken(refreshToken);
      }
      setUser(user);
      setAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    }
    clearAccessToken();
    clearRefreshToken();
    setUser(null);
    setAuthenticated(false);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
