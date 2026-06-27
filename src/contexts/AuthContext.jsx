import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth";
import { setAccessToken, clearAccessToken, getAccessToken } from "../api/token";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!getAccessToken()) {
      setLoading(false);
      return undefined;
    }

    (async () => {
      try {
        const res = await authService.refresh();
        const { accessToken, user } = res;
        if (accessToken) {
          setAccessToken(accessToken);
          setUser(user);
          setAuthenticated(true);
        }
      } catch (e) {
        clearAccessToken();
        setUser(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    // Limpa sessão anterior antes de logar
    clearAccessToken();
    setUser(null);
    setAuthenticated(false);

    const res = await authService.login(email, password);
    const { accessToken, user } = res;
    if (accessToken) {
      setAccessToken(accessToken);
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
