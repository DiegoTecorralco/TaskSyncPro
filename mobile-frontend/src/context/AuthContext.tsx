import React, { createContext, useContext, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  async function login(email: string, password: string) {
    if (
      email === "admin@test.com" &&
      password === "123456"
    ) {
      setUser({
        id: "1",
        name: "Administrador",
        email,
      });

      return true;
    }

    return false;
  }

  async function register(
    name: string,
    email: string,
    password: string
  ) {
    setUser({
      id: Date.now().toString(),
      name,
      email,
    });

    return true;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}