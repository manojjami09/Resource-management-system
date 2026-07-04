import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../lib/apiClient";

export interface User {
  id: number;
  email: string;
  role: string;
  employeeId?: number;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("rms_token");
    const storedUser = localStorage.getItem("rms_user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("rms_token");
        localStorage.removeItem("rms_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { token, id, email: userEmail, role, employeeId } = response.data;

      const userData: User = { id, email: userEmail, role, employeeId };

      localStorage.setItem("rms_token", token);
      localStorage.setItem("rms_user", JSON.stringify(userData));

      setToken(token);
      setUser(userData);
    } catch (error: any) {
      if (error.response?.status === 500 && error.response?.data?.message === "Bad credentials") {
        throw new Error("Invalid email or password");
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("rms_token");
    localStorage.removeItem("rms_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
