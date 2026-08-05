import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;

  updateProfile: (
    data: Partial<User>
  ) => Promise<boolean>;

  logout: () => Promise<void>;
}

interface StoredUser extends User {
  password: string;
}

const SESSION_KEY = "@tasksync_session";
const USERS_KEY = "@tasksync_users";

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    void restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const session =
        await AsyncStorage.getItem(
          SESSION_KEY
        );

      if (session) {
        const storedUser: User =
          JSON.parse(session);

        setUser(storedUser);
      }
    } catch (error) {
      console.error(
        "Error al restaurar la sesión:",
        error
      );

      await AsyncStorage.removeItem(
        SESSION_KEY
      );
    } finally {
      setLoading(false);
    }
  }

  async function getStoredUsers(): Promise<
    StoredUser[]
  > {
    try {
      const storedUsers =
        await AsyncStorage.getItem(
          USERS_KEY
        );

      return storedUsers
        ? JSON.parse(storedUsers)
        : [];
    } catch (error) {
      console.error(
        "Error al leer los usuarios:",
        error
      );

      return [];
    }
  }

  async function login(
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const users = await getStoredUsers();

      /*
       * Usuario de prueba.
       * Permite iniciar sesión aunque todavía
       * no se haya registrado ningún usuario.
       */
      if (
        users.length === 0 &&
        normalizedEmail ===
          "admin@tasksync.com" &&
        password === "123456"
      ) {
        const defaultUser: StoredUser = {
          id: Date.now().toString(),
          name: "Carlos",
          email: normalizedEmail,
          password,
        };

        await AsyncStorage.setItem(
          USERS_KEY,
          JSON.stringify([defaultUser])
        );

        const sessionUser: User = {
          id: defaultUser.id,
          name: defaultUser.name,
          email: defaultUser.email,
        };

        await saveSession(sessionUser);

        return true;
      }

      const foundUser = users.find(
        (storedUser) =>
          storedUser.email.toLowerCase() ===
            normalizedEmail &&
          storedUser.password === password
      );

      if (!foundUser) {
        return false;
      }

      const sessionUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar,
      };

      await saveSession(sessionUser);

      return true;
    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error
      );

      return false;
    }
  }

  async function register(
    name: string,
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const cleanName = name.trim();

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const users = await getStoredUsers();

      const emailExists = users.some(
        (storedUser) =>
          storedUser.email.toLowerCase() ===
          normalizedEmail
      );

      if (emailExists) {
        return false;
      }

      const newUser: StoredUser = {
        id: Date.now().toString(),
        name: cleanName,
        email: normalizedEmail,
        password,
      };

      const updatedUsers = [
        ...users,
        newUser,
      ];

      await AsyncStorage.setItem(
        USERS_KEY,
        JSON.stringify(updatedUsers)
      );

      const sessionUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };

      await saveSession(sessionUser);

      return true;
    } catch (error) {
      console.error(
        "Error al registrar el usuario:",
        error
      );

      return false;
    }
  }

  async function saveSession(
    sessionUser: User
  ) {
    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify(sessionUser)
    );

    setUser(sessionUser);
  }

  async function updateProfile(
    data: Partial<User>
  ): Promise<boolean> {
    if (!user) {
      return false;
    }

    try {
      const users = await getStoredUsers();

      const updatedUser: User = {
        ...user,
        ...data,
        id: user.id,
        name:
          data.name?.trim() ||
          user.name,
        email:
          data.email
            ?.trim()
            .toLowerCase() ||
          user.email,
      };

      const emailExists = users.some(
        (storedUser) =>
          storedUser.id !== user.id &&
          storedUser.email.toLowerCase() ===
            updatedUser.email.toLowerCase()
      );

      if (emailExists) {
        return false;
      }

      const updatedUsers = users.map(
        (storedUser) =>
          storedUser.id === user.id
            ? {
                ...storedUser,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar:
                  updatedUser.avatar,
              }
            : storedUser
      );

      await AsyncStorage.setItem(
        USERS_KEY,
        JSON.stringify(updatedUsers)
      );

      await saveSession(updatedUser);

      return true;
    } catch (error) {
      console.error(
        "Error al actualizar el perfil:",
        error
      );

      return false;
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem(
        SESSION_KEY
      );

      setUser(null);
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error
      );
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider."
    );
  }

  return context;
}