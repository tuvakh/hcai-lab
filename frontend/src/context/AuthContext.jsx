import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

function isTokenExpired(token) {
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function getStoredToken() {
  const token = sessionStorage.getItem("token");
  if (token && isTokenExpired(token)) {
    sessionStorage.removeItem("token");
    return null;
  }
  return token;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken);

  const user = token ? JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) : null;

  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    setToken(null);
  }, []);

  useEffect(() => {
    if (!token) return;
    const { exp } = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    const ms = exp * 1000 - Date.now();
    const timer = setTimeout(logout, ms);
    return () => clearTimeout(timer);
  }, [token, logout]);

  function login(newToken) {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
