import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";


interface AuthContextType {
  token: string | null;
  isAuthed: boolean;
  setToken: (newToken: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("token"));

  const setToken = (newToken: string | null) => {
    if (!newToken) {
      localStorage.removeItem("token");
      setTokenState(null);
      return;
    }
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  };

  const value = useMemo(
    () => ({
      token,
      isAuthed: Boolean(token),
      setToken,
      logout: () => setToken(null),
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  
  return ctx;
}